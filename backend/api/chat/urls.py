from django.urls import path
from .views import ConversationListCreateView, MessageDetailView, delete_conversation, MessageListCreateView

urlpatterns = [
    path(
        "conversations/",
        ConversationListCreateView.as_view(),
        name="conversation-list-create"
    ),
    path(
        "conversations/delete/<int:conversation_id>/",
        delete_conversation,
        name="conversation-delete"
    ),
    path(
        "conversations/<int:conversation_id>/messages/",
        MessageListCreateView.as_view(),
        name="message-list-create"
    ),
    path(
        "conversations/<int:conversation_id>/messages/<int:pk>/",
        MessageDetailView.as_view(),
        name="message-detail"
    ),

]
