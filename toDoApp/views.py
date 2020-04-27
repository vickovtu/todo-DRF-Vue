from rest_framework import generics, permissions
from .models import Todo
from .serializers import TodoSerializer, TodoCreateSerializer
from .permissions import IsAuthorOrReadOnly


# ListAPIView
class ListTodo(generics.ListCreateAPIView):
    """отображения всех todo"""

    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Todo.objects.filter(author=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return TodoSerializer
        else:
            return TodoCreateSerializer

    def perform_create(self, serializer):
        user = self.request.user
        return serializer.save(author=user)


# RetrieveAPIView
class DetailTodo(generics.RetrieveUpdateDestroyAPIView):
    """отображения одного экземпляра модели todo"""

    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = (IsAuthorOrReadOnly,)
