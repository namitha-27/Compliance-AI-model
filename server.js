// from flask import Flask, request, jsonify
// import json
// import os

// app = Flask(__name__)

// //Load JSON data from db.json
// def load_data():
//     if not os.path.exists("db.json"):
//         return {"models": []}  //Default empty database
//     with open("db.json", "r") as file:
//         return json.load(file)

// # Save JSON data to db.json
// def save_data(data):
//     with open("db.json", "w") as file:
//         json.dump(data, file, indent=4)

// @app.route('/check-compliance', methods=['POST'])
// def check_compliance():
//     //Parse request data
//     data = request.get_json()
//     if not data or "modelId" not in data:
//         return jsonify({"error": "modelId is required"}), 400
    
//     model_id = data["modelId"]

//     //Load models from the database
//     db_data = load_data()
//     model = next((m for m in db_data.get("models", []) if m["id"] == model_id), None)

//     if not model:
//         return jsonify({"error": "Model not found"}), 404

//     //Generate static compliance report
//     compliance_report = {
//         "compliance_status": "Evaluation in progress",
//         "data_usage": "Not evaluated yet",
//         "discrimination_check": "Not evaluated yet",
//         "proportionality_check": "Not evaluated yet",
//         "evaluation_criteria": [
//             "Data Context Relevance",
//             "Non-Discrimination",
//             "Proportional Treatment"
//         ]
//     }

//     # Attach the compliance report to the model
//     model["compliance_report"] = compliance_report

//     # Save the updated data back to the file
//     save_data(db_data)

//     return jsonify(model), 200

// if __name__ == '__main__':
//     app.run(port=5000, debug=True)
