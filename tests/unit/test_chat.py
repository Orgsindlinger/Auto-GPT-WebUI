# Generated by CodiumAI
import time
import unittest
from unittest.mock import patch

from autogpt.chat import create_chat_message, generate_context


class TestChat(unittest.TestCase):
    # Tests that the function returns a dictionary with the correct keys and values when valid strings are provided for role and content.
    def test_happy_path_role_content(self):
        result = create_chat_message("system", "Hello, world!")
        self.assertEqual(result, {"role": "system", "content": "Hello, world!"})

    # Tests that the function returns a dictionary with the correct keys and values when empty strings are provided for role and content.
    def test_empty_role_content(self):
        result = create_chat_message("", "")
        self.assertEqual(result, {"role": "", "content": ""})

    # Tests the behavior of the generate_context function when all input parameters are empty.
    @patch("time.strftime")
    def test_generate_context_empty_inputs(self, mock_strftime):
        # Mock the time.strftime function to return a fixed value
        mock_strftime.return_value = "Sat Apr 15 00:00:00 2023"
        # Arrange
        prompt = ""
        relevant_memory = ""
        full_message_history = []
        model = "gpt-3.5-turbo-0301"

        # Act
        result = generate_context(prompt, relevant_memory, full_message_history, model)

        # Assert
        expected_result = (
            -1,
            47,
            3,
            [
                {"role": "system", "content": ""},
                {
                    "role": "system",
                    "content": f"The current time and date is {time.strftime('%c')}",
                },
                {
                    "role": "system",
                    "content": f"This reminds you of these events from your past:\n\n\n",
                },
            ],
        )
        self.assertEqual(result, expected_result)

    # Tests that the function successfully generates a current_context given valid inputs.
    def test_generate_context_valid_inputs(self):
        # Given
        prompt = "What is your favorite color?"
        relevant_memory = "You once painted your room blue."
        full_message_history = [
            create_chat_message("user", "Hi there!"),
            create_chat_message("assistant", "Hello! How can I assist you today?"),
            create_chat_message("user", "Can you tell me a joke?"),
            create_chat_message(
                "assistant",
                "Why did the tomato turn red? Because it saw the salad dressing!",
            ),
            create_chat_message("user", "Haha, that's funny."),
        ]
        model = "gpt-3.5-turbo-0301"

        # When
        result = generate_context(prompt, relevant_memory, full_message_history, model)

        # Then
        self.assertIsInstance(result[0], int)
        self.assertIsInstance(result[1], int)
        self.assertIsInstance(result[2], int)
        self.assertIsInstance(result[3], list)
        self.assertGreaterEqual(result[0], 0)
        self.assertGreaterEqual(result[1], 0)
        self.assertGreaterEqual(result[2], 0)
        self.assertGreaterEqual(
            len(result[3]), 3
        )  # current_context should have at least 3 messages
        self.assertLessEqual(
            result[1], 2048
        )  # token limit for GPT-3.5-turbo-0301 is 2048 tokens
