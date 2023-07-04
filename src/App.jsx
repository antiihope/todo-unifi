import { useState } from 'react';
import './App.css';
import TodoList from './pages/TodoList.jsx';
import { useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const GetWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [location, setLocation] = useState(null);
  useEffect(() => {
    if (!hasAccess) return;
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=c9db0fdba62747558de7527d5de9db68`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setWeather(data);
        setLoading(false);
        if (data.cod === 401) setError(data.message);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [hasAccess]);
  useEffect(() => {
    const successCallback = (position) => {
      setHasAccess(true);
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    const errorCallback = (error) => {
      console.log(error);
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, []);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>There was an error getting weather data</p>;

  return (
    <div>
      <h5>Weather</h5>
      <h2>{weather && weather?.location?.name}</h2>
      <h2>{weather && weather?.current?.temp_c}</h2>
    </div>
  );
};

function App() {
  const [darkTheme, setDarkTheme] = useState(
    createTheme({
      palette: {
        mode: 'light',
      },
    })
  );

  const toggleTheme = () => {
    if (darkTheme.palette.mode === 'dark') {
      setDarkTheme(
        createTheme({
          palette: {
            mode: 'light',
          },
        })
      );
      document.querySelector(':root').style.setProperty('background', 'white');
      document.querySelector(':root').style.setProperty('color', '#1d1515de');
    } else {
      setDarkTheme(
        createTheme({
          palette: {
            mode: 'dark',
          },
        })
      );
      document
        .querySelector(':root')
        .style.setProperty('background', '#1d1515de');
      document.querySelector(':root').style.setProperty('color', 'white');
    }
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <header
          style={{
            top: 0,
            position: 'sticky',
            zIndex: 1000,
            width: '100%',
            maxHeight: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h1>Todo?!</h1>
          <button onClick={toggleTheme}>Toggle Theme</button>
        </header>

        <GetWeather />
        <div
          style={{
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <TodoList />
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
