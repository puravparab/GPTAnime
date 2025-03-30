## GPT-Anime (WIP)

Your photos reimagined in your favorite anime! Ghiblify your images or bulk create/edit images. This project is still a Work in Progress.

<img width="1506" alt="Screenshot 2025-03-29 at 7 30 37 PM" 
src="https://github.com/user-attachments/assets/
ee8129f4-30e7-4af3-8b7f-1788d026d0d4" />

## Models

- **GPT-4o Imagen** (When the API drops)
- **Gemini Flash Edit** (Currently Available)


## Installation

1. Clone the repository
	```bash
	git clone git@github.com:puravparab/GPTAnime.git
	```

2. Change directory
	```bash
	cd GPTAnime/src
	```

3. Install dependencies
	```bash
	bun install
	```

4. Run server
	```bash
	bun run dev
	```

## FAL Setup

1. Sign up for a FAL account at [fal.ai](https://fal.ai)

2. Get your FAL API key from your account dashboard

3. Create a `.env.local` file in the `src` directory with your FAL API key:
	```text
	FAL_API_KEY=your_api_key_here
	```

4. The application will now be able to use FAL's services for image processing and generation