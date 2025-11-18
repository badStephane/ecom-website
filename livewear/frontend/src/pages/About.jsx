import Title from './../components/Title';
import { assets } from './../assets/assets';

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
        <Title  text1={'A PROPOS'} text2={'DE NOUS'}/>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="about_img" />
        
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Livewear est une marque spécialisée dans les vêtements en crochet, en lin, en coton et les accessoires artisanaux.</p>

          <p>Son objectif est d’attirer des clients, de maximiser les ventes et d’imposer son identité sur le marché.</p>


          <b className='text-gray-800'>Notre mission</b>
          <p>Proposer des vêtements crochetés et en tissus naturels pour un style à la fois élégant, confortable et intemporel.</p>
        </div>

      </div>
      
      <div className='text-xl py-4'>
        <Title text1={'POURQUOI'} text2={'CHOISIR NOUS'}/>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-sm mb-20 justify-center gap-8'> 

          <div className='border px-10 md:px-16 py-8 sm:py-5 flex flex-col gap-5 text-justify'>
              <b>Artisanat:</b>
              <p className='text-gray-600'>Chaque vêtement ou accessoire est conçu à la main, avec soin et précision.</p>
          </div>

          <div className='border px-10 md:px-16 py-8 sm:py-5 flex flex-col gap-5'>
              <b>Durabilité:</b>
              <p className='text-gray-600'>Les matières utilisées (lin, coton, crochet) sont naturelles, résistantes et respectueuses de l’environnement.</p>
          </div>

          <div className='border px-10 md:px-16 py-8 sm:py-5 flex flex-col gap-5'>
              <b>Authenticité:</b>
              <p className='text-gray-600'>Livewear reflète une identité vraie, sans artifices, fidèle à ses racines et à son inspiration artisanale.</p>
          </div>

          <div className='border px-10 md:px-16 py-8 sm:py-5 flex flex-col gap-5'>
              <b>Féminité naturelle:</b>
              <p className='text-gray-600'>Les créations mettent en avant une élégance simple et douce, sans exagération.</p>
          </div>

          <div className='border px-10 md:px-16 py-8 sm:py-5 flex flex-col gap-5'>
              <b>Minimalisme:</b>
              <p className='text-gray-600'>Les designs se concentrent sur l’essentiel, avec des coupes épurées et des détails raffinés.</p>
          </div>

      </div>


    {/* <NewsletterBox/> */}

    </div>
  )
}

export default About
