
import json, time, uuid
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from pywebpush import webpush, WebPushException
from werkzeug.exceptions import NotFound


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./database.sql'
db = SQLAlchemy(app)
CORS(app)


class PushSubscription(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)

    public_id = db.Column(db.String(32), nullable=False, unique=True)
    subscription_json = db.Column(db.Text, nullable=False)

db.create_all()


@app.route('/test', methods=['GET'])
def test():
    return jsonify('Test server!')


@app.route('/api/push-subscriptions', methods=['POST'])
def create_subscription():
    json_string = request.get_data().decode('utf-8')
    subscription = PushSubscription.query.filter_by(
        subscription_json=json_string
    ).first()

    if subscription is None:
        subscription = PushSubscription(
            public_id=uuid.uuid4().hex,
            subscription_json=json_string
        )
        db.session.add(subscription)
        db.session.commit()

    return jsonify({
        'public_id': subscription.public_id
    })


@app.route('/api/send-push', methods=['POST'])
def send_push():
    subscriptions = PushSubscription.query.all()

    if not subscriptions:
        raise NotFound('No subscriptions')

    for subscription in subscriptions:
        try:
            webpush(
                subscription_info=json.loads(subscription.subscription_json),
                data=json.dumps({
                    'message': {
                        'id': uuid.uuid4().hex,
                        'from_id': 17,
                        'chat_id': 66,
                        'text': 'Hey There!',
                    },
                    'unread_messages': 13
                }),
                vapid_private_key='zBn90IZnuEab-VoDHptwFjXArlRVZoOlfwC6e5I5QRI',
                vapid_claims={
                    'sub': 'mailto:maximblizhin.motmom@gmail.com',
                    'exp': time.time() + 300 # 5 minutes
                }
            )
        except WebPushException as ex:
            print('Error: {}', repr(ex))
            # Mozilla returns additional information in the body of the response.
            if ex.response and ex.response.json():
                extra = ex.response.json()
                print(
                    'Remote service replied with a {}:{}, {}',
                    extra.code,
                    extra.errno,
                    extra.message
                )

    return jsonify({
        'status': 'success',
    })


if (__name__ == '__main__'):
    app.run(debug=True, host='0.0.0.0', port=8888)
