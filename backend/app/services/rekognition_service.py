import boto3
from botocore.exceptions import BotoCoreError, ClientError

class RekognitionService:
    def __init__(self, region_name='us-east-1'):
        self.client = boto3.client('rekognition', region_name=region_name)

    def create_collection(self, collection_id):
        try:
            self.client.create_collection(CollectionId=collection_id)
        except self.client.exceptions.ResourceAlreadyExistsException:
            pass  # La colección ya existe
        except (BotoCoreError, ClientError) as e:
            raise Exception(f"Error creando colección: {e}")

    def index_face(self, collection_id, image_bytes, external_image_id):
        try:
            response = self.client.index_faces(
                CollectionId=collection_id,
                Image={'Bytes': image_bytes},
                ExternalImageId=external_image_id,
                DetectionAttributes=[]
            )

            if not response["FaceRecords"]:
                raise Exception("No se detectó ningún rostro en la imagen")

            return response["FaceRecords"][0]["Face"]["FaceId"]

        except (BotoCoreError, ClientError) as e:
            raise Exception(f"Error indexando rostro: {e}")

    def search_face(self, collection_id, image_bytes, threshold=80, max_faces=1):
        try:
            response = self.client.search_faces_by_image(
                CollectionId=collection_id,
                Image={'Bytes': image_bytes},
                FaceMatchThreshold=threshold,
                MaxFaces=max_faces
            )

            if response["FaceMatches"]:
                return response["FaceMatches"][0]["Face"]["FaceId"]

            return None

        except (BotoCoreError, ClientError) as e:
            raise Exception(f"Error buscando rostro: {e}")
        
    def delete_collection(self, collection_id):
        try:
            self.client.delete_collection(CollectionId=collection_id)
            return True
        except self.client.exceptions.ResourceNotFoundException:
            return False
        except (BotoCoreError, ClientError) as e:
            raise Exception(f"Error eliminando colección: {e}")
