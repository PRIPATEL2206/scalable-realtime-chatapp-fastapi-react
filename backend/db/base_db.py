from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column,DATETIME,String
from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import datetime 
import os




SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(SQLALCHEMY_DATABASE_URL)
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
    id = Column(String(50) ,primary_key=True, nullable=False)
    created_at=Column(String(50) )
    last_updated=Column(String(50))

    def add(self,db:Session):
        self.id = str(uuid4())
        self.created_at=str(datetime.now())
        self.last_updated=str(datetime.now())
        db.add(self)
        db.commit()
        db.refresh(self)
        
    def update(self,db:Session):
        self.last_updated=str(datetime.now())
        db.commit()

