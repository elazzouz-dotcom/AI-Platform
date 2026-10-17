/**
 * Joke Service
 * Fetches jokes from external APIs
 * Supports multiple joke APIs and categories
 */

export interface Joke {
  id: string;
  content: string;
  type: 'single' | 'two-part';
  setup?: string;
  delivery?: string;
  category: string;
  rating: number;
  timestamp: number;
}

class JokeService {
  private baseUrls = {
    primary: 'https://v2.jokeapi.dev/joke',
    fallback: 'https://official-joke-api.appspot.com/jokes'
  };

  /**
   * Get random joke with optional category
   */
  async getRandomJoke(category: string = 'any'): Promise<Joke> {
    try {
      // Try primary API first
      return await this.fetchFromJokeAPI(category);
    } catch (error) {
      // Fallback to secondary API
      return await this.fetchFromOfficialAPI();
    }
  }

  /**
   * Fetch from JokeAPI.dev
   */
  private async fetchFromJokeAPI(category: string): Promise<Joke> {
    const categoryPath = category !== 'any' ? category : 'Any';
    const url = `${this.baseUrls.primary}/${categoryPath}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('JokeAPI failed');

    const data = await response.json();

    if (data.error) throw new Error(data.message);

    const joke: Joke = {
      id: `joke-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: data.type === 'single' ? data.joke : '',
      type: data.type as 'single' | 'two-part',
      setup: data.setup,
      delivery: data.delivery,
      category: data.category || category,
      rating: this.generateRating(),
      timestamp: Date.now()
    };

    return joke;
  }

  /**
   * Fetch from Official Joke API (fallback)
   */
  private async fetchFromOfficialAPI(): Promise<Joke> {
    const url = `${this.baseUrls.fallback}/random`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Official API failed');

    const data = await response.json();

    const joke: Joke = {
      id: `joke-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: data.setup ? `${data.setup} ${data.punchline}` : data.joke || '',
      type: data.setup ? 'two-part' : 'single',
      setup: data.setup,
      delivery: data.punchline,
      category: data.category || 'general',
      rating: this.generateRating(),
      timestamp: Date.now()
    };

    return joke;
  }

  /**
   * Generate random rating
   */
  private generateRating(): number {
    return Math.round((Math.random() * 5 + 5) * 10) / 10; // 5-10 range
  }

  /**
   * Get jokes by category
   */
  async getJokesByCategory(category: string, count: number = 5): Promise<Joke[]> {
    const jokes: Joke[] = [];
    for (let i = 0; i < count; i++) {
      try {
        const joke = await this.getRandomJoke(category);
        jokes.push(joke);
      } catch (error) {
        console.error('Error fetching joke:', error);
      }
    }
    return jokes;
  }

  /**
   * Search jokes by keyword
   */
  async searchJokes(keyword: string): Promise<Joke[]> {
    try {
      const response = await fetch(
        `https://official-joke-api.appspot.com/jokes/search?query=${encodeURIComponent(keyword)}`
      );
      const data = await response.json();

      return data.map((item: any, index: number) => ({
        id: `joke-${Date.now()}-${index}`,
        content: item.setup ? `${item.setup} ${item.punchline}` : item.joke || '',
        type: item.setup ? 'two-part' : 'single',
        setup: item.setup,
        delivery: item.punchline,
        category: item.category || 'general',
        rating: this.generateRating(),
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }
}

export const jokeService = new JokeService();
