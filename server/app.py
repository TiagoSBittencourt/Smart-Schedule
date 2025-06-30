import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import math
import random

app = Flask(__name__)
CORS(app)

def calculate_schedule(data):
    subjects = data.get('subjects', [])
    availability = data.get('availability', {})

    if not subjects or not any(availability.values()):
        return {"error": "Matérias ou horários disponíveis não fornecidos."}


    total_weight = sum(s['weight'] for s in subjects)
    if total_weight == 0:
        return {"error": "O peso total das matérias não pode ser zero."}

    availabile_slots = []
    for day, slots in availability.items():
        for slot in slots:
            availabile_slots.append({"day": day, "slot": slot})


    total_available_hours = len(availabile_slots)

    if total_available_hours == 0:
        return {"error": "Nenhum horário disponível foi informado."}

    study_blocks = []
    for subject in subjects:
        proportion = subject['weight'] / total_weight

        hours_for_subject = round(proportion * total_available_hours)

        for _ in range(hours_for_subject):
            study_blocks.append({
                "name": subject['name'],
                "color": subject.get("color", "#9d98df")
            })

    while len(study_blocks) < total_available_hours:
        study_blocks.append(max(subject, key=lambda s: s['weight'])['name'])

    while len(study_blocks) > total_available_hours:
        study_blocks.pop()

    random.shuffle(study_blocks)

    final_schedule = {day: {} for day in availability.keys()}
    for i, slot_info in enumerate(availabile_slots):
        day = slot_info['day']
        slot = slot_info['slot']
        if i < len(study_blocks):
            final_schedule[day][slot] = study_blocks[i]

    return final_schedule

@app.route('/api/generate-plan', methods=['POST'])
def base_route():
    try:
        data = request.get_json()

        # Data expected (ex.:)
        # {
        #   "subjects": [
        #     {"name": "Matemática", "weight": 5},
        #     {"name": "Português", "weight": 3},
        #     {"name": "Ciências", "weight": 4}
        #   ],
        #   "availability": {
        #     "segunda": ["18:00-19:00", "19:00-20:00"],
        #     "terca": ["18:00-19:00"],
        #     ...
        #   }
        # }

        schedule = calculate_schedule(data)

        if "error" in schedule:
            return jsonify(schedule), 400 # Bad Request
        
        return jsonify(schedule), 200 # OK

    except Exception as e:
        return jsonify({"error": "Ocorreu um erro no servidor.", "detail": str(e)}), 500 # Internal Server Error
    

if __name__ == '__main__':
    app.run(debug=True)