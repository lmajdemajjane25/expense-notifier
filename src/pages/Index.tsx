
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard since we're using the Layout component
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
};

export default Index;
