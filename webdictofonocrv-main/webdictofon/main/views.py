from django.shortcuts import render
from django.http import HttpResponse
import pandas as pd


logs = pd.read_csv('../input_files/zoo.csv', sep='`', names=['text', 'text_instruction'])
# Create your views here.



def index(request):
    i = 0
    text = logs['text'][i]
    text_instruction = logs['text_instruction'][i]
    data = {"text": text, "text_instruction": text_instruction }
    return render(request, 'main/index.html', context=data)
