The following readme didn't use any kind of IA. It was all written by hand by me at 1am. 
# nombre_proyecto

## Overview
nombre_proyecto is a protocol and application for buying tickets. This is usefull for music shows, congresses and any other event. 

* nombre_proyecto eliminates intermediaries like PassLine, Ticketek, etc. by allowing a smart contract to process the purchases.
* nombre_proyecto prevents ticket re-selling by associating a ticket with credential identity, like DNI, Passport or email. 
* nombre_proyecto doesn't show anyone (not even the event organizer) who's the buyer and attendee.
* The user only reveals the required data (DNI) at the venue, required by a validator at the moment of check-in. 

This application is meant for 3 kinds of user:
* The Event Organizer (or just **Organizer**): it creates and publishes the event.
* The buyer, client or **atendee**: it buys the ticket and presents it at the venue for the check-in.
* The **validator**: works for the venue and validates the atendees' tickets.

## Protocol detail
1) The Organizer creates an **event**. An Event is defined by:
    * Name and description
    * Necessary client data (like full name, government id, passport, birth date or email). Note: not all of this data is necessarily gonna be disclosed.
    * Amount of aviable spaces. A more complex and future implementation includes different kind of venue locations.
    * Price

On the backend, this is going to deploy a Midnight smart contract with an owner (the creator of the event). This smart contract contains all the data relevant to the event, and the logic to manage the interactions that will be explained in the next sections. The important thing to have in mind is that the contract address must be published for everyone to see and buy tickets. 

2) The client enters the publisher's page and finds the corresponding event (there might be more than one). Another option is that there's a hub of events where the clients can see events published by many organizers. By ckicking the desired event, the client will find a form with all the personal data needed to buy the ticket. This data will not be published on the public ledger.

After filling this forms, the client will do 2 things:
* Create a Merkle Tree on the client side. The leafs are the client data, in the order declared by the event (hence by the contract). A future implementation could improve security by mixing a secret salt along with each piece of information. 
* Create a transaction to the event's contract. This transaction does 3 things:
    * Subscribe the Merkle Root of the ticket to the public ledger. This will be used in the validator section.
    * Pay for the ticket.
    * Subtract 1 from the available tickets (and fail if such amount is already 0).

2) El cliente entra a la pagina y ve el listado de eventos publicados por el organizador (u organizadores distintos). En el frontend de de la aplicación llena un formulario. Este formulario contiene todos los datos necesarios del cliente para el evento. 

2) Estos datos no salen del dispositivo del usuario. En lugar de eso, el cliente crea un merkle root a partir de estos datos. También va a crear un codigo QR que va a contener:

    * El dato que va a tener que ser revelado al llegar al evento
    * El merkle path de ese dato y
    * El merkle root del arbol creado

Esto representa la entrada del cliente. Sin embargo, para que sea válida tiene que "comprarla". No hay intermediarios: el cliente genera una transacción en Midnight donde los inputs privados son todos los datos del usuario. El contrato va a crear este MerkleRoot y lo va a guardar en el ledger público dentro de un listado de "entradas compradas". 


3) El cliente llega al evento. El validator le pide el código QR y valida el merkle path offchain respecto al dato provisto y el merkle root. Hace una query al contrato para 

    * Ver que efectivamente el merkle root está en el listado de entradas
    * Marca la entrada como comprada

