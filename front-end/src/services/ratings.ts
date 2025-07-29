import axios from 'axios';

export const rateSuggestion = async (mixHash: string, like: boolean) => {
  return axios.post('/api/ratings', { mixHash, like });
};
 
export const fetchRatingCounts = async (mixHash: string) => {
  const res = await axios.get(`/api/ratings/${mixHash}`);
  return res.data; // {likes, dislikes}
}; 