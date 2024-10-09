# 🎥 Streamify

### Welcome to Streamify! This is a Youtube-like platform where users can view, upload and share videos. The frontend is built using react and backend is powered by Node.js. It's a complete MERN application.

## 🚧 Project Status

### The project is complete but new features and improvements can be added gradually.

## 🚀 Features

-   📹 **Upload Videos**: Share your videos with the world.
-   🎥 **Watch Videos**: Enjoy videos uploaded by others.
-   🐦 **Tweets**: Make announcements for everyone.
-   👍 **Like**: Leave a thumbs up to videos, comments and tweets you like.
-   💬 **Comment**: Share your thoughts about the video.
-   📺 **Subscriptions**: Get videos from channels you subscribe to.
-   🕒 **History**: Revisit the videos you have watced.
-   🔍 **Search**: Find videos by keywords.
-   📂 **My Content**: Manage all your content in one place.
-   🛠 **Admin Panel**: Manage your channel and videos.
-   ⚙️ **Settings**: Update your personal and channel information and password.

## 🛠️ Technologies Used

-   **Frontend**:

    -   React
    -   Redux Toolkit
    -   Tailwind CSS
    -   Axios
    -   React Router Dom
    -   React Redux
    -   React Hook Form
    -   React Toastify
    -   React Infinite Scroll
    -   React Icons

-   **Backend**:
    -   Node.js
    -   Express
    -   MongoDB
    -   Cloudinary
    -   Multer
    -   JWT (JSON Web Tokens)
    -   Bcrypt (Hashing password)

## 🔗 Important Links

| Content           | Link                                                                             |
| ----------------- | -------------------------------------------------------------------------------- |
| Live Link         | [click here ](https://streamify-video-streaming.vercel.app)                      |
| API Documentation | [click here ](https://documenter.getpostman.com/view/18766081/2sAXxP9CHB)        |
| Model             | [click here ](https://app.eraser.io/workspace/cATefMPkrAdzR9c6teox?origin=share) |
| Figma Design      | [click here ](https://www.figma.com/design/shmxWL5FKRO5GNOPPopBg6/PLAY)          |

## 🏗️ Installation

### Prerequisites

-   Node.js
-   npm (Node Package Manager)
-   MongoDB

### Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/Sameer0820/Video-Streaming-App.git
    ```

2. **Install dependencies**:

    ```bash
    cd server
    npm install
    ```

    ```bash
    cd client
    npm install
    ```

3. **Setup environment variables**:
   Create a `.env` file in server directory and add the following:

    ```env
    PORT=your_port_number
    MONGODB_URI=your_mongodb_uri
    CORS_ORIGIN=*
    ACCESS_TOKEN_SECRET=your_access_token_secret
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    REFRESH_TOKEN_EXPIRY=10d
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

4. **Run the backend**:
    ```bash
    cd server
    npm run dev
    ```

5. **Run the frontend**:
   ```bash
   cd client
   npm run dev
   ```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request.

## Contact

For any questions or feedback, feel free to reach out:

- Email: sameerraj0820@gmail.com