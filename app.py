from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import random
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Get API key from environment
openai_api_key = os.getenv('OPENAI_KEY')

# Import OpenAI with version check
try:
    # For openai >= 1.0.0
    from openai import OpenAI
    client = OpenAI(api_key=openai_api_key)
    
    def get_completion(prompt):
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
except (ImportError, TypeError):
    # Fallback for older openai versions
    import openai
    openai.api_key = openai_api_key
    
    def get_completion(prompt):
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content

MEAL_DB = {
    "ghanaian": {
        "breakfast": ["Hausa koko with koose", "Waakye", "Tom Brown porridge"],
        "lunch": ["Fufu with light soup", "Banku with tilapia", "Jollof rice"],
        "dinner": ["Tuo zaafi with soup", "Kenkey with fried fish", "Omo tuo"]
    },
    "nigerian": {
        "breakfast": ["Akara with pap", "Moi moi with bread", "Yam and egg"],
        "lunch": ["Pounded yam with egusi", "Amala with ewedu", "Ofada rice"],
        "dinner": ["Eba with okro soup", "Pepper soup", "Jollof rice"]
    }
}

@app.route('/api/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        cuisine = data.get('cuisine')
        meal_time = data.get('meal_time')
        
        # Validate parameters
        if not cuisine or not meal_time:
            return jsonify({"error": "Missing required parameters"}), 400
            
        if cuisine not in MEAL_DB:
            return jsonify({"error": f"Cuisine '{cuisine}' not supported"}), 400
            
        if meal_time not in MEAL_DB[cuisine]:
            return jsonify({"error": f"Meal time '{meal_time}' not supported"}), 400
        
        # Basic recommendation
        meal = random.choice(MEAL_DB[cuisine][meal_time])
        
        # AI enhancement with error handling
        try:
            prompt = f"Give detailed cooking instructions for {meal} in 50 words:"
            instructions = get_completion(prompt)
        except Exception as e:
            # Fallback if OpenAI API fails
            instructions = f"Simple instructions for {meal}: Prepare ingredients, cook according to traditional methods, serve hot."
            print(f"OpenAI API error: {str(e)}")
        
        return jsonify({
            "meal": meal,
            "instructions": instructions
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/', methods=['GET'])
def health_check():
    """Basic health check endpoint for deployment platforms"""
    return jsonify({"status": "healthy", "service": "aimenuplanner"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)