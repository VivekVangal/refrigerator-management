use actix_cors::Cors;
use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgPoolOptions, Pool, Postgres};

#[derive(Serialize, Deserialize)]
struct FridgeItem {
    id: Option<i32>,
    name: String,
    quantity: f32,
    unit: String,
    expiry_date: DateTime<Utc>,
    category: String,
    storage_location: String,
}

struct AppState {
    db: Pool<Postgres>,
}

// POST endpoint to add/update item
async fn update_item(
    item: web::Json<FridgeItem>,
    data: web::Data<AppState>,
) -> impl Responder {
    let result = sqlx::query!(
        r#"
        INSERT INTO fridge_items (name, quantity, unit, expiry_date, category, storage_location)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
        "#,
        item.name,
        item.quantity,
        item.unit,
        item.expiry_date,
        item.category,
        item.storage_location
    )
    .fetch_one(&data.db)
    .await;

    match result {
        Ok(row) => HttpResponse::Ok().json(row.id),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

// GET endpoint to retrieve all items
async fn get_items(data: web::Data<AppState>) -> impl Responder {
    let result = sqlx::query_as!(
        FridgeItem,
        r#"
        SELECT id, name, quantity, unit, expiry_date, category, storage_location
        FROM fridge_items
        "#
    )
    .fetch_all(&data.db)
    .await;

    match result {
        Ok(items) => HttpResponse::Ok().json(items),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    
    // Database connection setup
    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to create pool");

    // Create tables if they don't exist
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS fridge_items (
            id SERIAL PRIMARY KEY,
            name VARCHAR NOT NULL,
            quantity FLOAT NOT NULL,
            unit VARCHAR NOT NULL,
            expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
            category VARCHAR NOT NULL,
            storage_location VARCHAR NOT NULL
        )
        "#,
    )
    .execute(&pool)
    .await
    .expect("Failed to create table");

    // Start HTTP server
    HttpServer::new(move || {
        let cors = Cors::permissive(); // Configure CORS for development

        App::new()
            .wrap(cors)
            .app_data(web::Data::new(AppState { db: pool.clone() }))
            .service(web::resource("/api/items")
                .route(web::get().to(get_items))
                .route(web::post().to(update_item)))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
} 