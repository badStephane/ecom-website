
import Title from './../components/Title';
import { assets } from './../assets/assets';
import NewsletterBox from './../components/NewsletterBox';
const Contact = () => {
  return (
    <div>

      <div className="text-center text-2xl pt-10 border-t">
        <Title  text1={'CONTACTEZ'} text2={'NOUS'}/>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="contact_img" />

        <div className='flex flex-col justify-center items-start gap-6'> 
          <p className='font-semibold text-xl'>Notre magasin</p>
          <p className='text-gray-500'>Sector 10, Uttara Model Town <br />Dhaka-1230</p>
          <p className='text-gray-500'>Tel: +221 773548342 <br />Email: stephane.badiane.dev@gmail.com </p>
          {/* <p className='font-semibold text-xl text-gray-600'>Carrières chez Livewear</p>
          <p className='text-gray-500'>Découvrez plus sur notre équipe et les ouvertures d'emplois.</p>

            <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500 '>Explore Jobs</button> */}
        
        </div>
      
      </div>

      {/* <NewsletterBox/> */}

    </div>
  )
}

export default Contact
