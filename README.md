# BambooDigital

# Project Setup Instructions

## Prerequisites

- **Python** (version 3.6 or higher)
- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)

## MongoDB Server Setup

### 1. Create a Virtual Environment

To create a virtual environment, follow these steps:

```bash
# Create a virtual environment
python -m venv venv_name

# Activate the virtual environment (Windows)
venv_name\Scripts\activate

# Activate the virtual environment (MacOS/Linux)
source venv_name/bin/activate

```
### 2. Install Required Packages

Install the required packages from the requirements.txt file:

```bash

pip install -r requirements.txt

```

### 3. Run MongoDB Server

Navigate to the BambooDigital/fastapi-mongodb-app directory and run the server:

```bash
uvicorn main:app --reload
```

## Node.js and React Setup

### 1. Install Node Modules

Navigate to the BambooDigital/my-app directory and install all the node modules:

```bash
npm install
```

### 2. Run React Server

To start the React server, use the following command:

```bash
npm start
```

## Additional Information

Ensure you have Python and Node.js installed on your system.
For any issues, refer to the respective documentation or contact the project maintainer.
