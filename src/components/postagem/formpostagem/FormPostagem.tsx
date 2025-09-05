import { useContext, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type Tema from "../../../models/Tema";
import { AuthContext } from "../../../contexts/AuthContext";
import { atualizar, buscar, cadastrar } from "../../../services/Service";
import type Postagem from "../../../models/Postagem";
import { ClipLoader } from 'react-spinners';


function FormPostagem() {

    const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState<boolean>(false)

    const [temas, setTemas] = useState<Tema[]>([])

    const [tema, setTema] = useState<Tema>({ id: 0, descricao: '', })

    const [postagem, setPostagem] = useState<Postagem>({} as Postagem)

	const { usuario, handleLogout } = useContext(AuthContext)
	const token = usuario.token;

	const { id } = useParams<{ id: string }>()

	async function buscarPostagemPorId(id: string) {
		try {
			await buscar(`/postagens/${id}`, setPostagem, {
				headers: { Authorization: token },
			})
		} catch (error: any) {
			if (error.toString().includes('401')) {
				handleLogout()
			}
		}
	}

    async function buscarTemaPorId(id: string) {
        try {
            await buscar(`/temas/${id}`, setTema, {
                headers: { Authorization: token },
            })
        } catch (error: any) {
            if (error.toString().includes('401')) {
                handleLogout()
            }
        }
    }

    async function buscarTemas() {
        try {
            await buscar('/temas', setTemas, {
                headers: { Authorization: token },
            })
        } catch (error: any) {
            if (error.toString().includes('401')) {
                handleLogout()
            }
        }
    }

    useEffect(() => {
        if (token === '') {
            alert('Você precisa estar logado!')
            navigate('/')
        }
    }, [token])

    useEffect(() => {
        buscarTemas()
        if (id !== undefined) {
            buscarPostagemPorId(id)
        }
    }, [id])

    useEffect(() => {
        setPostagem({
            ...postagem,
            tema: tema,
        })
    }, [tema])


    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setPostagem({
            ...postagem,
            [e.target.name]: e.target.value,
        })
    }

    function atualizarTema(e: ChangeEvent<HTMLSelectElement>) {
        buscarTemaPorId(e.target.value)
    }

    async function gerarNovaPostagem(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        if (id !== undefined) {
            try {
                await atualizar('/postagens', postagem, setPostagem, {
                    headers: {
                        Authorization: token,
                    },
                })
                alert('A postagem foi atualizada com sucesso!')
            } catch (error: any) {
                if (error.toString().includes('401')) {
                    handleLogout()
                } else {
                    alert('Erro ao atualizar a postagem.')
                }
            }
        } else {
            try {
                await cadastrar('/postagens', postagem, setPostagem, {
                    headers: {
                        Authorization: token,
                    },
                })
                alert('A postagem foi cadastrada com sucesso!')
            } catch (error: any) {
                if (error.toString().includes('401')) {
                    handleLogout()
                } else {
                    alert('Erro ao cadastrar a postagem.')
                }
            }
        }

        setIsLoading(false)
        retornar()
    }

    function retornar() {
        navigate('/postagens')
    }

    const carregandoTema = tema.descricao === '' && id !== undefined

    return (
        <div className='container flex flex-col mx-auto items-center justify-center'>
            <h1 className='text-4xl text-center my-8'>
                {id === undefined ? 'Cadastrar Postagem' : 'Editar Postagem'}
            </h1>
            <form className='flex flex-col gap-4 w-1/2' onSubmit={gerarNovaPostagem}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="titulo">Título da Postagem</label>
                    <input
                        type="text"
                        id="titulo"
                        placeholder="Digite o Título aqui"
                        name="titulo"
                        required
                        className="border-2 border-slate-700 rounded p-2"
                        value={postagem.titulo}
					    onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}/>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="texto">Texto da Postagem</label>
                    <input
                        type="text"
                        id="texto"
                        placeholder="Digite o Texto aqui"
                        name="texto"
                        required
                        className="border-2 border-slate-700 rounded p-2"
                        value={postagem.texto}
					    onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}/>
                </div>
                <div className="flex flex-col gap-2">
                    <p>Tema da Postagem</p>
                    <select
                        name="tema"
                        id="tema"
                        className='border p-2 border-slate-800 rounded'
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => atualizarTema(e)}
                        value={tema.id}
                        >
                        <option value="" disabled>Selecione um Tema</option>
                        {temas.map((tema) => (
                            <option key={tema.id} value={tema.id} >{tema.descricao}</option>
                        ))}
                    </select>
                </div>
                <button
                    type='submit'
                    className='rounded disabled:bg-slate-200 bg-indigo-400 hover:bg-indigo-800
                               text-white font-bold w-1/2 mx-auto py-2 flex justify-center'
                    disabled={carregandoTema}>
                    
                    {isLoading ?
                    <ClipLoader color='#ffffff'
                    size={24}
                    /> :
                    <span> {id === undefined ? 'Cadastrar' : 'Atualizar'} </span>}
                </button>
            </form>
        </div>
    );
}

export default FormPostagem;