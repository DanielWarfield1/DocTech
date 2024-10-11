import docTech
from flask import Flask, jsonify, request
from dotenv import load_dotenv
app = Flask(__name__)
load_dotenv() 

@app.route("/")
def hello():
  query = request.args.get('query')
  page = int(request.args.get('current_page'))
  try:
    return jsonify(docTech.handle_query(query, {'current_page': page}))
  except Exception as e:
    print('exception! (probably searched for a figure and there wasnt one)')
    print(e)
    print('---------')
    return None

if __name__ == "__main__":
  app.run()