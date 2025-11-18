import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import CategoryList from '../components/CategoryList'
import LatestCollection from '../components/LatestCollection'
import OurPolicy from '../components/OurPolicy'
// import NewsletterBox from '../components/NewsletterBox'

const Home = () => {
  const navigate = useNavigate()

  const handleCategorySelect = (category) => {
    // Navigate to collection page with category filter
    navigate('/collection', { state: { selectedCategory: category } })
  }

  return (
    <div>
      <Hero/>
      <CategoryList onCategorySelect={handleCategorySelect} />
      <LatestCollection/>
      <OurPolicy/>
      {/* <NewsletterBox/> */}
    </div>
  )
}

export default Home
