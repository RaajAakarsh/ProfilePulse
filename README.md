# ProfilePulse
ProfilePulse is a platform where you can create an account, log in securely, and view other registered users. Powered by Django on the backend and React on the frontend.  Token-based authentication system utilizing Simple JWT has been utilized to maintain account security.

Make sure you have the following installed on your system:

    - Node.js
    - Python (for Django)

Frontend Setup

    - Navigate to the frontend folder.
    - Run the following command to install the required dependencies: npm install
    - After the installation is complete, start the frontend server with the following command: npm run start
    - This will run the frontend on http://localhost:3000/.

Backend Setup

    - Navigate to the backend folder.
    - Run the following command to install the required Python dependencies: pip install -r requirements.txt
    - Next in the settings.py file mention your "email" and and "email app password".
    - If your are using gmail then you can generate the "email app password" only after activating 2 step verification.
    - make sure to apply the migrations
    - After the installation is complete, start the Django development server with the following command: python manage.py runserver This will run the backend on http://localhost:8000/.

Accessing the Website
Once both the frontend and backend servers are running, you can access the polling website by visiting http://localhost:3000/ in your web browser.
