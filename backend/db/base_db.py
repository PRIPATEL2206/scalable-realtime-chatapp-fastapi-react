from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column,DATETIME,String
from uuid import uuid4
import datetime 




SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args = 
{"check_same_thread": False
 })
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    Base.metadata.create_all(bind=engine)

class CustomBaseDB():
    id = Column(String(20),default=str(uuid4()) ,primary_key=True, nullable=False)
    created_at=Column( DATETIME, default=datetime.datetime.now(datetime.UTC))
    last_updated=Column(DATETIME,default=datetime.datetime.now(datetime.UTC),onupdate=datetime.datetime.now(datetime.UTC))



