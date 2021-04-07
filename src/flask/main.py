from youtube_transcript_api import YouTubeTranscriptApi
from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS, cross_origin


app = Flask(__name__)


@app.route('/transcript')
@cross_origin()
def get_transcript():
    video_id = request.args.get('videoId')
    text = []
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
        # print('transcript', transcript)

        for script in transcript:
            text.append(script['text'])
    except Exception as e:
        print(e)

    return jsonify(text)


if __name__ == '__main__':
    app.run(debug=True)
