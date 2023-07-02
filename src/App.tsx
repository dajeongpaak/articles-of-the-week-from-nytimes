
import './App.css';

import Header from './components/Header';
import Footer from './components/Footer'
import CardList from './components/card/CardList';
import SignUpForm from './components/form/SignUpForm';
import { ArticleProvider } from './context/ArticleContext';


function App() {
  return (
    <ArticleProvider>
      <Header 
        title='The Most Viewed Articles for the last 7 days'
        projectName='Articles of the Week from NY Times'
      />
      <CardList />
      <SignUpForm 
        title='Subscribe for Weekly Updates: 
        '
        subtitle='Stay Up-to-Date with the Latest News and Insights.'/>
      <Footer/>
    </ArticleProvider>
  );
}

export default App;
