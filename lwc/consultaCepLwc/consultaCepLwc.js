import { LightningElement, api, track } from 'lwc';

import consultaCep from '@salesforce/apex/consultaCepController.consultaCep';
import setEnderecoAccount from '@salesforce/apex/consultaCepController.setEnderecoAccount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ConsultaCepLwc extends LightningElement {

    @api recordId;
    @track endereco;
    @track valueCepConsulta = '';
    @track valueLogradouro = '';
    @track valueCidade = ''
    @track valueCep = '';
    @track valueEstado = '';

    handleCep(event) {
        this.valueCepConsulta = event.target.value

        console.log(this.valueCepConsulta.length)
    }

    handleConsultar() {

        consultaCep({ cep:this.valueCepConsulta })
        .then((value) => {
            console.log(value)
            let result = JSON.parse(value);

            if(result.localidade == null) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Ops!',
                        message: 'Cep inválido!',
                        variant: 'error'
                    })
                );
            }

            this.valueLogradouro = (result.logradouro != null) ? result.logradouro : ''
            this.valueCidade = (result.localidade != null) ? result.localidade : ''
            this.valueCep = (result.cep != null) ? result.cep : ''
            this.valueEstado = (result.uf != null) ? result.uf : ''
        }).catch((error) => {
            console.log(error)
        })
    }

    handleSalvarEndereco() {

        let endereco = {
            logradouro:this.valueLogradouro,
            localidade:this.valueCidade,
            cep:this.valueCep,
            uf:this.valueEstado
        }

        setEnderecoAccount({ endereco:JSON.stringify(endereco), recordId:this.recordId })
        .then((result) => {
            if(result) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Sucesso!',
                        message: 'Endereço salvo com sucesso!',
                        variant: 'success'
                    })
                );

                const valueChangeEvent = new CustomEvent("valuechange", {
                    detail: true
                });
                  // Fire the custom event
                this.dispatchEvent(valueChangeEvent);
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    handleCepValue(event) {

        switch(event.target.name) {
            case 'logradouro':
                this.valueLogradouro = event.target.value
                break;
            case 'cidade':
                this.valueCidade = event.target.value
                break;
            case 'cep':
                this.valueCep = event.target.value
                break;
            case 'estado':
                this.valueEstado = event.target.value
                break;
        }
    }

    reset() {
        this.valueLogradouro = '';
        this.valueCidade = '';
        this.valueCep = '';
        this.valueEstado = '';
        this.valueCepConsulta = '';
    }

    get valueCepTamanhoAdequado() {
        return this.valueCepConsulta.length != 8
    }

    get aptoSave() {
        return this.valueLogradouro.length == 0 || this.valueCidade.length == 0 || this.valueCep.length == 0 || this.valueEstado.length == 0
    }
}