import unittest
import json
from app import create_app
from blushy.models import db, Message


class TestBlushy(unittest.TestCase):
    """Unit tests for Blushy app"""

    def setUp(self):
        """Set up test client and database"""
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.client = self.app.test_client()
        
        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        """Clean up after tests"""
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_home_page(self):
        """Test home page loads successfully"""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Blushy', response.data)

    def test_create_message_success(self):
        """Test creating a message with valid data"""
        data = {
            'text': 'I love you!',
            'targetName': 'Sarah',
            'primaryColor': '#ff6b9d',
            'secondaryColor': '#ffd60a',
            'backgroundColor': '#0a0e27',
            'emojis': ['✨', '💕', '🤭'],
            'transitionType': 'fadeIn',
            'animationDuration': 2000,
            'fontFamily': 'Poppins',
            'fontSize': 48,
            'backgroundEffect': 'gradient'
        }
        
        response = self.client.post(
            '/api/messages',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 201)
        response_data = json.loads(response.data)
        self.assertTrue(response_data['success'])
        self.assertIn('message', response_data)
        self.assertIn('shareLink', response_data)
        self.assertEqual(response_data['message']['text'], 'I love you!')
        self.assertEqual(response_data['message']['targetName'], 'Sarah')

    def test_create_message_missing_text(self):
        """Test creating a message without required text field"""
        data = {
            'targetName': 'Sarah',
            'primaryColor': '#ff6b9d'
        }
        
        response = self.client.post(
            '/api/messages',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.data)
        self.assertIn('errors', response_data)

    def test_create_message_no_json(self):
        """Test creating a message without JSON data"""
        response = self.client.post('/api/messages')
        
        # Server returns 500 when no JSON is provided
        self.assertEqual(response.status_code, 500)
        response_data = json.loads(response.data)
        self.assertIn('error', response_data)

    def test_get_message_success(self):
        """Test retrieving an existing message"""
        # Create a message first
        with self.app.app_context():
            message = Message(
                link_id='test123',
                text='Hello World!',
                target_name='John',
                primary_color='#ff6b9d',
                secondary_color='#ffd60a',
                background_color='#0a0e27',
                emojis='✨,💕,🤭',
                transition_type='fadeIn',
                animation_duration=2000,
                font_family='Poppins',
                font_size=48,
                background_effect='gradient'
            )
            db.session.add(message)
            db.session.commit()
        
        response = self.client.get('/api/messages/test123')
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.data)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['message']['text'], 'Hello World!')
        self.assertEqual(response_data['message']['targetName'], 'John')

    def test_get_message_not_found(self):
        """Test retrieving a non-existent message"""
        response = self.client.get('/api/messages/nonexistent')
        
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.data)
        self.assertIn('error', response_data)

    def test_view_message_page(self):
        """Test viewing a message page"""
        # Create a message first
        with self.app.app_context():
            message = Message(
                link_id='view123',
                text='Test message',
                target_name='Jane',
                primary_color='#ff6b9d',
                secondary_color='#ffd60a',
                background_color='#0a0e27'
            )
            db.session.add(message)
            db.session.commit()
        
        response = self.client.get('/m/view123')
        
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Test message', response.data)

    def test_view_message_not_found(self):
        """Test viewing a non-existent message page"""
        response = self.client.get('/m/notfound')
        
        self.assertEqual(response.status_code, 404)

    def test_message_expiration(self):
        """Test message expiration check"""
        with self.app.app_context():
            message = Message(
                link_id='expire123',
                text='Expired message',
                target_name='Bob'
            )
            db.session.add(message)
            db.session.commit()
            # Check that message is not expired initially
            self.assertFalse(message.is_expired())

    def test_link_id_generation(self):
        """Test unique link ID generation"""
        with self.app.app_context():
            link_id1 = Message.generate_link_id()
            link_id2 = Message.generate_link_id()
            
            self.assertIsNotNone(link_id1)
            self.assertIsNotNone(link_id2)
            self.assertNotEqual(link_id1, link_id2)
            self.assertEqual(len(link_id1), 8)
            self.assertEqual(len(link_id2), 8)

    def test_message_to_dict(self):
        """Test message serialization to dictionary"""
        with self.app.app_context():
            message = Message(
                link_id='dict123',
                text='Test dict',
                target_name='Alice',
                primary_color='#ff6b9d'
            )
            db.session.add(message)
            db.session.commit()
            
            message_dict = message.to_dict()
            
            self.assertIsInstance(message_dict, dict)
            self.assertEqual(message_dict['link_id'], 'dict123')
            self.assertEqual(message_dict['text'], 'Test dict')
            self.assertEqual(message_dict['targetName'], 'Alice')
            self.assertIn('createdAt', message_dict)


if __name__ == '__main__':
    unittest.main()
