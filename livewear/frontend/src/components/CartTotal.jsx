import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {

const {currency, getCartAmount} = useContext(ShopContext);

  return (
    <div className='w-full'>
        <div className='text-2xl'>
         <Title text1={'TOTAL'} text2={'PANIER'}/>
        </div>

        <div className='flex flex-col gap-2 mt-2 text-sm'>

            <div className='flex justify-between'>
                <p>Montant total :</p>
                <p>{currency}{getCartAmount()}.00</p>
            </div>

            <hr />

            <div className='flex justify-between'>
                <b>Total :</b>
                <b>{currency}{getCartAmount()}.00</b>
            </div>

        </div>
    </div>
  )
}

export default CartTotal;