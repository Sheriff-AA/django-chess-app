# Chess App Made with Django

This is a web-based chess application built using Django, JavaScript, and the Stockfish chess engine. The application allows users to play chess against an AI opponent with varying difficulty levels.

## Technologies Used

- **Backend:**
  - Django 4.2.18
  - Python 3.12
  - Stockfish chess engine

- **Frontend:**
  - HTML
  - CSS
  - JavaScript
  - jQuery
  - Bootstrap

- **Other Tools:**
  - Docker
  - Gunicorn
  - Whitenoise

## Features

- Play chess against an AI opponent.
- Choose the difficulty level by setting the depth of the AI's search.
- View the evaluation of the current position.
- Change the board theme.
- Take back moves and start a new game.
- Responsive design for different screen sizes.

## Setup and Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Sheriff-AA/django-chess-app.git
   cd chess-app
   ```

2. **Create and activate a virtual environment:**
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install the dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a .env file in the root directory and add the following:
   ```env
   DJANGO_SECRET_KEY=your_secret_key
   DJANGO_DEBUG=True
   CSRF_TRUSTED_ORIGINS=your_csrf_trusted_origins
   ALLOWED_HOST=your_allowed_host
   ```

5. **Run the migrations:**
   ```sh
   python manage.py migrate
   ```

6. **Collect static files:**
   ```sh
   python manage.py collectstatic
   ```

7. **Run the development server:**
   ```sh
   python manage.py runserver
   ```

8. **Access the application:**
   Open your browser and go to 
   ```sh
   http://127.0.0.1:8000
   ```


## Docker Setup

1. **Build the Docker image:**
   ```sh
   docker build -t chess-app .
   ```

2. **Run the Docker container:**
   ```sh
   docker run -p 8000:8000 chess-app
   ```

3. **Access the application:**
   Open your browser and go to 
   ```sh
   http://127.0.0.1:8000
   ```

## Time Spent

The project took approximately 40 hours to complete, including:

- Setting up the Django project and configuring settings.
- Implementing the chess logic and integrating the Stockfish engine.
- Developing the frontend with HTML, CSS, and JavaScript.
- Testing and debugging the application.
- Writing documentation and setting up Docker.

## Difficulties Faced

- **Integrating Stockfish:** Ensuring the Stockfish engine works seamlessly with the Django backend.
- **Frontend Development:** Creating a responsive and user-friendly interface.
- **Docker Configuration:** Setting up the Dockerfile and ensuring the application runs smoothly in a containerized environment.
- **Evaluation Function:** Implementing an accurate evaluation function for the AI.

## Future Improvements

- Add user authentication and profiles.
- Implement multiplayer functionality.
- Enhance the AI with more advanced algorithms.
- Improve the UI/UX design.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

- [Stockfish](https://stockfishchess.org/) for the powerful chess engine.
- [Django](https://www.djangoproject.com/) for the robust web framework.
- [Chessboard.js](https://github.com/oakmac/chessboardjs) for the chessboard UI.
- [Bootstrap](https://getbootstrap.com/) for the responsive design framework.

