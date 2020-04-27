from django.test import TestCase
from django.contrib.auth.models import User
from .models import Todo


class TodoTests(TestCase):

    @classmethod
    def setUpTestData(cls):
        testuser1 = User.objects.create_user(username='testuser1', password='abc123')
        testuser1.save()
        test_todo = Todo.objects.create(
            author=testuser1, title='todo title', body='Body content...')
        test_todo.save()

    def test_blog_content(self):
        todo = Todo.objects.get(id=1)

        expected_author = f'{todo.author}'
        expected_title = f'{todo.title}'
        expected_body = f'{todo.body}'
        self.assertEqual(expected_author, 'testuser1')
        self.assertEqual(expected_title, 'todo title')
        self.assertEqual(expected_body, 'Body content...')
