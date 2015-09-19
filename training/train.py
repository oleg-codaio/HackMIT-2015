import json
from lib.clarifai_basic import ClarifaiCustomModel

clarifai = ClarifaiCustomModel()

with open('training_data.json') as data_file:
    data = json.load(data_file)

    concepts = data['concepts']
    for concept in concepts:
        for url in concepts[concept]['positive_urls']:
            print concept + " POSITIVE: " + url
            clarifai.positive(url, concept)

        for url in concepts[concept]['negative_urls']:
            clarifai.negative(url, concept)