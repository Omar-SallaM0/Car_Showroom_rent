# Car Showroom

## Description
Car Showroom is a modern, responsive web application showcasing a diverse collection of vehicles. Built with Next.js 14.0.4, this platform offers an immersive browsing experience for car enthusiasts and potential buyers. The application fetches real-time data from an external API, ensuring up-to-date information on various car models, specifications, and pricing. With its sleek design and efficient performance, Car Showroom demonstrates the power of server-side rendering and the latest web technologies in creating engaging automotive showcases.


## Topics
nextjs react typescript car-catalog api-integration server-side-rendering responsive-design automotive-industry user-interface

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
5. [Usage](#usage)
6. [API Integration](#api-integration)
7. [Deployment](#deployment)
8. [Contributing](#contributing)
9. [License](#license)
10. [Acknowledgements](#acknowledgements)

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository**
   ```
   git clone https://github.com/yusrilprayoga-code/car-showroom.git
   cd car-showroom
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add your API key:
   ```
   API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```
   npm run dev
   ```

Your Car Showroom application should now be running at `http://localhost:3000`.

## Admin Dashboard

Admin access is separate from website accounts and uses a server-only `ADMIN_ACCESS_CODE`. Set it to exactly eight letters and/or digits in `.env.local`; it is never included in client-side code. Successful entry creates a 12-hour HttpOnly session. Failed attempts are throttled. Admin pages and inventory APIs reject requests without a valid session.

The first catalogue read seeds `data/cars.json` from the existing car source. Admin changes and public listings then use that shared file. The inventory and admin session files are ignored by Git. This file-backed store is intended for development or a self-hosted Node server with persistent writable storage; it is not durable on Vercel/serverless deployments. Use a managed database and session store before deploying admin CRUD to serverless hosting.

Set `CAR_DATA_FILE` to an absolute path on a persistent writable volume when running the app on a self-hosted server. Image entries may be `http(s)` URLs or paths relative to the site root.

## Usage

To use the Car Showroom website:

1. **Browse Cars**: 
   - Navigate through the homepage to see featured cars.
   - Use the search bar to find specific models or brands.

2. **View Details**:
   - Click on a car card to view detailed specifications.
   - Explore high-quality images, performance stats, and pricing information.

3. **Filter Options**:
   - Use the sidebar filters to narrow down your search by make, model, year, or price range.

4. **Compare Models**:
   - Select multiple cars to compare their features side by side.

5. **Responsive Design**:
   - Enjoy a seamless experience across desktop, tablet, and mobile devices.

## Credits

This project leverages the following technologies and resources:

- [Next.js 14.0.4](https://nextjs.org/) - The React framework for production
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Car Data API] - Using Rapid-Api

Special thanks to the open-source community and all contributors who have helped shape this project.
