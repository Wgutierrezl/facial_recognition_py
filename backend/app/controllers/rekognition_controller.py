from app.services.rekognition_service import RekognitionService
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv
load_dotenv()


router=APIRouter(
    prefix='/rekognition',
    tags=['Rekognition']
)

@router.post('/createCollection')
def create_collection():
    try:
        rekog_service=RekognitionService()

        collection_id=os.getenv('REKOGNITION_COLLECTION_ID')
        
        rekog_service.create_collection(collection_id)

        return {'message':'collection created','status':True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete('/deleteCollection')
def delete_collection():
    try:
        rekog_service=RekognitionService()

        collection_id='users_collection'

        rekog_service.delete_collection(collection_id)

        return {'message':'collection delete correctly','status':True}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        



