import sys
from lib.clarifai_basic import ClarifaiCustomModel

clarifai = ClarifaiCustomModel()

print clarifai.predict_all(sys.argv[1])