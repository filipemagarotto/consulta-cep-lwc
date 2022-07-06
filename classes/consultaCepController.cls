public with sharing class consultaCepController {
    
    @AuraEnabled
    public static String consultaCep(String cep) {
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://viacep.com.br/ws/'+cep+'/json/');
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        CepEntity results;
        // If the request is successful, parse the JSON response.
        if(response.getStatusCode() == 200) {
            results = (CepEntity) JSON.deserialize(response.getBody(), CepEntity.class);
        }

        return JSON.serialize(results);
    }

    @AuraEnabled
    public static Boolean setEnderecoAccount(String endereco, String recordId) {

        Boolean controle = false;
        try {
            CepEntity results = (CepEntity) JSON.deserialize(endereco, CepEntity.class);

            Account conta = [SELECT Id, BillingCity, BillingStreet, BillingState, BillingPostalCode FROM Account WHERE Id =:recordId];
            conta.BillingCity = results.localidade;
            conta.BillingPostalCode = results.cep;
            conta.BillingState = results.uf;
            conta.BillingStreet = results.logradouro;

            update conta;

            controle = true;

        }catch(Exception ex) {
            System.debug(ex.getMessage());
        }
        
        return controle;
    }

    public class CepEntity {
        public String cep;
        public String logradouro;
        public String complemento;
        public String bairro;
        public String localidade;
        public String uf;
        public String ibge;
        public String gia;
        public String ddd;
        public String siafi;
    }
}