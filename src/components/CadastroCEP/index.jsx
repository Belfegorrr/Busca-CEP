import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { useForm } from "react-hook-form";
import ModalFinal from "../ModalFinal";
import "../../App.css";

export default function CEP() {
  const firebaseApp = initializeApp({
    apiKey: "AIzaSyCGlG8A0ExAtD-je4RyyR8lldDfTdHZsk0",
    authDomain: "buscar-cep-45344.firebaseapp.com",
    projectId: "buscar-cep-45344",
  });

  const db = getFirestore(firebaseApp);

  const onSubmit = (data) => console.log(data);
  const { register, handleSubmit, setValue, setFocus } = useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const cadastroCollectionRef = collection(db, "cadastro");
  let [cadastro, setCadastro] = useState([]);

  async function criarCadastro() {
    let cadastro = await addDoc(cadastroCollectionRef, {
      cep,
      rua,
      bairro,
      cidade,
      estado,
    });
  }

  useEffect(() => {
    const getCadastro = async () => {
      const data = await getDocs(cadastroCollectionRef);
      setCadastro(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getCadastro();
  }, []);

  const checkCEP = (e) => {
    const cep = e.target.value.replace(/\D/g, "");

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((res) => res.json())
      .then((data) => {
        setValue("adress", data.logradouro);
        setValue("bairro", data.bairro);
        setValue("cidade", data.localidade);
        setValue("estado", data.uf);
        setFocus("adressNumber");
      });
  };

  return (
    <div>
      <button
        className="buscarCep"
        onClick={() => setIsModalVisible(true)}
      >
        Buscar CEP
      </button>
      {isModalVisible ? (
        <ModalFinal onClose={() => setIsModalVisible(false)}>
          <form className="form-cep" onSubmit={handleSubmit(onSubmit)}>
            <h1>Buscar CEP</h1>
            <label>CEP</label>
            <input
              className="cep-form col-form-label col-sm-2 pt-0"
              type="text"
              placeholder="00000-000"
              {...register("cep")}
              onBlur={checkCEP}
              value={cep}
              onChange={(e) => setCep(e.target.value)}
            />
            <label>Bairro</label>
            <input
              className="bairro-form"
              type="text"
              placeholder="Bairro"
              {...register("bairro")}
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
            {/* <label>Nº</label>
            <input
              className="numero-form"
              type="text"
              placeholder="000"
              {...register("adressNumber")}
            /> */}
            <label>Rua</label>
            <input
              className="rua-form cidade-form ol-md-6"
              type="text"
              placeholder="Logradouro"
              {...register("adress")}
              value={rua}
              onChange={(e) => setRua(e.target.value)}
            />
            <label>Cidade</label>
            <input
              className="cidade-form ol-md-6"
              type="text"
              placeholder="Cidade"
              {...register("cidade")}
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
            <label>Estado</label>
            <input
              className="cidade-form"
              type="text"
              placeholder="Estado"
              {...register("estado")}
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            />
            <button onClick={criarCadastro} className="btn-form">
              Continuar
            </button>
          </form>
        </ModalFinal>
      ) : null}
    </div>
  );
}
