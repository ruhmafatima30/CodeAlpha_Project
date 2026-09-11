from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/translate", methods=["POST"])
def translate():

    try:
        data = request.get_json()

        text = data.get("text", "").strip()
        source = data.get("source", "en")
        target = data.get("target", "ur")

        if not text:
            return jsonify({
                "success": False,
                "error": "Please enter some text."
            }), 400

        if source == "auto":
            source = "en"

        # MyMemory Translation API
        url = "https://api.mymemory.translated.net/get"

        params = {
            "q": text,
            "langpair": f"{source}|{target}"
        }

        response = requests.get(
            url,
            params=params,
            timeout=20
        )

        result = response.json()

        if response.status_code != 200:
            return jsonify({
                "success": False,
                "error": "Translation service is unavailable."
            }), 500

        if result.get("responseStatus") != 200:
            return jsonify({
                "success": False,
                "error": "Translation failed."
            }), 500

        translated_text = result["responseData"]["translatedText"]

        return jsonify({
            "success": True,
            "translatedText": translated_text
        })

    except requests.exceptions.Timeout:

        return jsonify({
            "success": False,
            "error": "The translation service took too long."
        }), 504

    except requests.exceptions.RequestException:

        return jsonify({
            "success": False,
            "error": "Could not connect to translation service."
        }), 500

    except Exception as error:

        print("Error:", error)

        return jsonify({
            "success": False,
            "error": "Something went wrong."
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=8000)