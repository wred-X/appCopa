import Image from 'next/image';
import appPreviewImg from '../assets/app-nlw-copa-preview.png';
import logoImg from '../assets/logo.svg';
import userAvatar from '../assets/users-avatar-example.png';
import iconCheckImg from '../assets/icon-check.svg';
import { api } from '../lib/axios';
import { FormEvent, useState } from 'react';

interface HomeProps {
  betCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
const [betTitle, setBetTitle] = useState('')

  async function createBet(event: FormEvent){
    event.preventDefault()

    try {
      const response = await api.post('/bets',{
        title: betTitle,
      })

      const { code } = response.data

      navigator.clipboard.writeText(code)

      alert('Bolão criado com sucesso, código foi para a area de transferencia')
      setBetTitle('')
    } catch (err) {
      console.log(err)
      alert('Falha ao criar bolão')
    }
  }


  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center'>
      <main>
        <Image src={logoImg} alt="logo"/>

        <h1 className='mt-14 text-white-500 text-5xl font-bold leading-tight'>
          Crie seu proprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2 '>
          <Image src={userAvatar} alt="avatar"/>

          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.userCount}</span> pessoas já estão usando
          </strong>
        </div>


        <form onSubmit={createBet} className='mt-10 flex gap-2'>
          <input 
            className='flex-1 px-6 py-4 rounded bg-gray-800 text-gray-100 border border-gray-600 text-sm' 
            type="text" 
            required 
            placeholder="Qual nome do seu bolão?"
            onChange={event => setBetTitle(event.target.value)}
            value={betTitle}
          />
          <button 
            className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700'
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          Após criar seu bolão você recebera um codigo unico que poderá usar para convidar seus amigos
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt=""/>
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.betCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600'/>

          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt=""/>
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image src={appPreviewImg} alt="dois celulares" quality={100}/>
    </div>
  )
}

export const getServerSideProps = async () => {
  const [
    betCountResponse, 
    guessCountResponse,
    userCountResponse
  ] = await Promise.all([
    api.get('bets/count'),
    api.get('guesses/count'),
    api.get('users/count')
  ])

  return { 
    props: {
      betCount: betCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count
    }
  }
}