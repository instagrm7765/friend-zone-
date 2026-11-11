from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "Social Platform API"
    database_url: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 60

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Settings()
