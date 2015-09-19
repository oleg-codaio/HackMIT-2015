import sys
from lib.clarifai_basic import ClarifaiCustomModel

clarifai = ClarifaiCustomModel()

print clarifai.predict(sys.argv[1], sys.argv[2])