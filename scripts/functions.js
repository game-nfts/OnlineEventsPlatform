let eventData;

showEventContent();
showMintContent(null);

getEvents();
connectWallet();
initMetamaskEvents();


function showEventError(text){
	const eventsList = document.getElementById("events-list");
	eventsList.innerHTML =
	`
	<div class="card center">
        <div class="error"><b>Error:</b> ${text}</div>
  	</div> 
	`;
}


function showConnectError(text){
	const connectionErrorBlocks = document.querySelectorAll(".connect-error");	
	connectionErrorBlocks.forEach((item)=>{
		item.innerHTML =
		`<div class="error"><b>Error:</b> ${text}</div>`;
	})	
}


function hideConnectError(){
	const connectionErrorBlocks = document.querySelectorAll(".connect-error");	
	connectionErrorBlocks.forEach((item)=>{
		item.innerHTML =``;
	})	
}


function showConnectBtn(){
	const connectBlock = document.querySelectorAll(".connect-wallet");	
	connectBlock.forEach((item)=>{
		item.innerHTML = `<button onclick="connectWallet()" class="btn">Connect wallet</button>`;
	})	
}

function showConnectedWallet(address){
	const connectBlock = document.querySelectorAll(".connect-wallet");
	const formatedAdress = address.substr(0, 7) + " . . . " + address.substr(35);	
	connectBlock.forEach((item)=>{
		item.innerHTML = `
		<button class="connected-wallet">
			<b>Connected wallet:</b><br>
			${formatedAdress}
		</button>
		`;
	})	
}


function showCreateEventBtn(){
	const createEventBlock = document.querySelectorAll(".create-event");	
	createEventBlock.forEach((item)=>{
		item.innerHTML = `<a href="./create-event.html"><button class="createEvent-btn">Create Event</button></a>`;
	})
}


function hideCreateEventBtn(){
	const createEventBlock = document.querySelectorAll(".create-event");
	createEventBlock.forEach((item)=>{
		item.innerHTML = ``;
	})
}


function showEditEventBtn(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const eventId = urlParams.get('id')
	const editEventBlock = document.getElementById("edit-event");	
	editEventBlock.innerHTML = `<div class="create-event"><a href="./edit-event.html?id=${eventId}"><button class="createEvent-btn">Edit Event</button></a></div>`;
}

function hideEditEventBtn(){
	const editEventBlock = document.getElementById("edit-event");	
	editEventBlock.innerHTML = ``;
}



function showFormError(text){
	const formErrorBlock = document.getElementById("form-error");
	formErrorBlock.innerHTML = `<div class="error"><b>Error:</b> ${text}</div>`;
}

function hideFormError(){
	const formErrorBlock = document.getElementById("form-error");
	formErrorBlock.innerHTML = ``;
}


function hideCreateBtn(){
	document.getElementById("create-event-btn").style.display = "none";
}

function showCreateBtn(){
	document.getElementById("create-event-btn").style.display = "inherit";
}

function hideCreateEditMessage(){
	document.getElementById("waiting-create").innerHTML = "";
}

function showCreateEditMessage(type, text){
	document.getElementById(`waiting-create`).innerHTML = `<div class="${type} center">${text}</div><br>`;
}

function showCreateEditEventLoading(){
	let block;
	if(page == "view-event"){
		block = document.getElementById("view-event");	
	} else {
		block = document.getElementById("create-event");	
	}
	block.innerHTML = 
	`
		<div class="center">
          	<div class="lds-ripple"><div></div><div></div></div>
        </div>
    `;
}

function showCreateEditEventError(text){
	let block;
	if(page == "view-event"){
		block = document.getElementById("view-event");	
	} else{
		block = document.getElementById("create-event");	
	}
	block.innerHTML = `<div class="error"><b>Error:</b> ${text}</div>`;
}

function addStreamError(text){
	const streamBlock = document.getElementById("stream-block");
	streamBlock.innerHTML = `<div class="error">${text}</div>`;
}


function clearForm(){
	const eventTitle = document.getElementById("event-title");
	const eventDescription = document.getElementById("event-description");
	const eventStream = document.getElementById("event-stream");
	const eventDate = document.getElementById("event-date");
	const eventImage = document.getElementById("event-image");

	eventTitle.value = "";
	eventDescription.value = "";
	eventStream.value = "";
	eventDate.value = "";
	eventImage.value = "";
}

function checkFormData(type, data){
	hideCreateEditMessage();

	const eventTitle = document.getElementById("event-title");
	const eventDescription = document.getElementById("event-description");
	const eventStream = document.getElementById("event-stream");
	const eventDate = document.getElementById("event-date");
	const eventNft = document.querySelector('input[name="event-nft"]:checked');
	const eventImage = document.getElementById("event-image");

	currentTimeToUtcTimestamp = toTimestamp(new Date().toUTCString());
	eventTitle.style.border = "";
	eventDescription.style.border = "";
	eventStream.style.border = "";
	eventDate.style.border = "";
	eventImage.style.border = "";

	const eventDateUtcTimestamp = inputDateToTimestamp();

	if(!eventTitle.value.trim()){
		eventTitle.focus();
		eventTitle.style.border = "2px solid red";
		showFormError("Insert a title!")
		return false;
	}
	if(!eventDescription.value.trim()){
		eventTitle.style.border = "";
		eventDescription.focus();
		eventDescription.style.border = "2px solid red";
		showFormError("Write a description!");
		return false;
	}
	if(!eventStream.value.trim()){
		eventTitle.style.border = "";
		eventDescription.style.border = "";
		eventStream.focus();
		eventStream.style.border = "2px solid red";
		showFormError("Insert steam URL!");
		return false;
	}
	if(!eventDate.value.trim()){
		eventTitle.style.border = "";
		eventDescription.style.border = "";
		eventStream.style.border = "";
		eventDate.focus();
		eventDate.style.border = "2px solid red";
		showFormError("Chose a date!");
		return false;
	}
	if(eventDateUtcTimestamp - currentTimeToUtcTimestamp <= 0){
		eventDate.focus();
		eventDate.style.border = "2px solid red";
		showFormError("Date and time of event must be greater than the current date and time!");
		return false;
	}

	if(type == "create"){
		if(!eventImage.value.trim()){
			eventTitle.style.border = "";
			eventDescription.style.border = "";
			eventStream	.style.border = "";
			eventDate.style.border = "";
			eventImage.focus();
			eventImage.style.border = "2px solid red";
			showFormError("Chose a image!");
			return false;
		}
	}

	if(eventImage.files[0] && eventImage.files[0].type != "image/jpeg" && eventImage.files[0].type != "image/png"){
		eventTitle.style.border = "";
		eventDescription.style.border = "";
		eventStream	.style.border = "";
		eventDate.style.border = "";
		eventImage.focus();
		eventImage.style.border = "2px solid red";
		showFormError("Image must have '.png' or '.jpg' extension!");
		return false;
	}

	eventTitle.style.border = "";
	eventDescription.style.border = "";
	eventDate.style.border = "";
	eventImage.style.border = "";
	hideFormError();

	return true;
}


async function getEvents(){
	try{
		const INSTANCE_EVENTS_CONTRACT = new ethers.Contract(EVENTS_CONTRACT_ADDRESS, EVENTS_CONTRACT_ABI, RPC_PROVIDER);
		let eventsCount = await INSTANCE_EVENTS_CONTRACT.getCount();
		eventsCount = parseInt(eventsCount._hex, 16);

		if(!eventsCount){
			showEvents([]);
			showUpcomingEvents([]);
		}
		else{
			let promisesGetEventsUri = [];
			let promisesGetEventsMetadata = [];
			let ids = [];

			for(var i = 1; i <= eventsCount; i++){
				ids.push(null);
				promisesGetEventsUri.push(INSTANCE_EVENTS_CONTRACT.getEventByPosition(i));
			}

			const eventsUri = [];
	        const promiseResponseGetEventsUri = await Promise.allSettled(promisesGetEventsUri);

            promiseResponseGetEventsUri
            .map((promise, index) => {
	            if (promise.status == "fulfilled"){
	                eventsUri.push(promise.value[0]);
	            }
	        });

	        eventsUri.map((uri) => {
	        	promisesGetEventsMetadata.push(fetch("https://cloudflare-ipfs.com/ipfs/" + uri));
	        })

	        const promisesResponseJsonGetEventsMetadata = [];
	        const promisesResponseGetEventsMetadata = await Promise.allSettled(promisesGetEventsMetadata);

	        promisesResponseGetEventsMetadata.map((promise, index) => {
	            if (promise.status == "fulfilled"){
	                promisesResponseJsonGetEventsMetadata.push(promise.value.json());
	            } else {
	            	promisesResponseJsonGetEventsMetadata.push(Promise.resolve(null));
	            }
	        });

	        let eventsMetadata = await Promise.all(promisesResponseJsonGetEventsMetadata);

	        eventsMetadata.map((item, index) =>{
	        	if(item){
	        		item.event_id = index + 1;
	        		return item;
	        	}
	        })

	     	if(page == "home"){
	     		showEvents(eventsMetadata);
	     	}

	     	let upcomingEvents = [...eventsMetadata];
	     	let upcomingEventsSorted = [];

	     	const currentTimeToUtcTimestamp = toTimestamp(new Date().toUTCString());

	     	upcomingEvents.sort(function(a, b) {
				var keyA = a.date, keyB = b.date;
				if (keyA < keyB) return -1;
				if (keyA > keyB) return 1;
			  	return 0;
			});

			let showed = 0;
	     	for(var i = 0; i < upcomingEvents.length; i++){
	     		if(showed <= 2){
	     			if(upcomingEvents[i] && upcomingEvents[i].date > currentTimeToUtcTimestamp){
	     				upcomingEventsSorted.push(upcomingEvents[i]);
	     				showed++;
	     			}
	     		}
	     	}
	     	showUpcomingEvents(upcomingEventsSorted);
		}
	}
	catch(e){
		console.log(e);
		showEventError(e)
	}
	
}

function showEvents(data){
	if(page == "home"){
		const eventsList = document.getElementById("events-list");
		if(data.length == 0){
			eventsList.innerHTML = 
			`<div class="card event center">
	        	<p>No events was found</p>
	      	</div>
			`;	
			return;
		}
		let toAdd = "";
		for(var i = data.length - 1; i >= 0; i--){
			if(data[i]){
				let formatedData = new Date(data[i].date * 1000).toUTCString().substr(0,25);
				toAdd += 
				`<div class="card">
			        <a href="./event.html?id=${data[i].event_id}">
			          <img class="event-image" src="https://cloudflare-ipfs.com/ipfs/${data[i].image}" alt="">
			        </a>

			        <a href="./event.html?id=${data[i].event_id}">
			          <h2>${data[i].title}</h2>
			        </a>

			        <p><b>Start date:</b> ${formatedData} (UTC)</p>
			        <p><b>Need NFT Events Pass:</b> ${(data[i].nft == "true" ? "YES" : "NO")}</p>
			        <p style=" text-align: justify; ">${data[i].description}</p>

			      </div>`;
			}
		}
		eventsList.innerHTML = toAdd;
	}

}


function showUpcomingEvents(data){
	const upcomingEvents = document.getElementById("upcoming-events");
	if(data.length == 0){
		upcomingEvents.innerHTML = `<div>No upcoming events</div>`;	
		return;
	}
	let toAdd = "";
	for(var i = 0; i < data.length; i++){
		let formatedData = new Date(data[i].date * 1000).toUTCString().substr(0,25);
		toAdd += 
		`<div class="upcoming-event">
        	<p class="date">${formatedData} UTC</p>
          	<p class="title">
            	<a href="./event.html?id=${data[i].event_id}">${data[i].title}</a>
          	</p>
        </div>`;
	}
	upcomingEvents.innerHTML = toAdd;
}



async function showCreateEditEventForm(){
	const createEventBlocks = document.getElementById("create-event");	
	const currentUTCdate = new Date().toISOString().substr(0,16);
	const currentConnectedWallet = await getConnectedWallet();

	if(!isOwner(currentConnectedWallet)){
		showCreateEditEventError("No permission !")
	}
	else if(!isCorrectChain(window.ethereum.networkVersion)){
		showCreateEditEventError(`Please connect to ${CHAIN_NAME}`)
	}
	else {
		if(page == "create-event"){
			createEventBlocks.innerHTML = 
			`
				<label for="event-title">Event title:</label>
		        <input type="text" name="event-title" id="event-title">

		        <label for="event-description">Event description:</label>
		        <textarea rows="10" name="event-description" id="event-description"></textarea>

		        <label for="event-stream">Event stream URL:</label>
		        <input type="text" name="event-stream" id="event-stream">

		        <label for="event-date">Event date [UTC]:</label>
		        <input type="datetime-local" name="event-date" id="event-date" min="${currentUTCdate}" >

		        <label for="event-image">Event image:</label>
		        <input type="file" name="event-image" id="event-image">

		        <label for="event-nft">Need NFT Event Pass:</label><br>
		        <input type="radio" name="event-nft" value="true" checked="true">Yes<br>
		        <input type="radio" name="event-nft" value="false">No

		        <br>
		        <div id="form-error"></div>
		        <br>

		        <div id="waiting-create"></div>
		        <button id="create-event-btn" class="btn btn-black">Create</button>
			`;

			document.getElementById("create-event-btn").addEventListener("click", ()=>{
				createEvent({});
			})
		}

		else if(page == "edit-event"){
			const checkResult = await checkEventId();
			
			if(checkResult[0] == false){
				showCreateEditEventError("Inexistent event");
				return;
			}

			const eventDate = new Date(checkResult[1].date * 1000).toISOString().substr(0,16);
			const oldImageUrl = checkResult[1].image;

			createEventBlocks.innerHTML = 
			`
				<label for="event-title">Event title:</label>
		        <input type="text" name="event-title" id="event-title" value="${checkResult[1].title}">

		        <label for="event-description">Event description:</label>
		        <textarea rows="10" name="event-description" id="event-description">${checkResult[1].description}</textarea>

		        <label for="event-stream">Event stream URL:</label>
		        <input type="text" name="event-stream" id="event-stream" value="${checkResult[1].stream}">

		        <label for="event-date">Event date [UTC]:</label>
		        <input type="datetime-local" name="event-date" id="event-date" min="${currentUTCdate}" value="${eventDate}">

		        <label for="event-image">Event image:</label>
	        	<img src="https://cloudflare-ipfs.com/ipfs/${oldImageUrl}" class="event-image-form" >

		        <label for="event-image">New event image:</label>
		        <input type="file" name="event-image" id="event-image">

		        <label for="event-nft">Need NFT Event Pass:</label><br>
		        <input type="radio" name="event-nft" value="true" ${checkResult[1].nft == "true" ? 'checked' : ''}>Yes<br>
		        <input type="radio" name="event-nft" value="false" ${checkResult[1].nft === "true" ? '' : 'checked'}>No<br>

		        <br>
		        <div id="form-error"></div>
		        <br>

		        <div id="waiting-create"></div>

		        <button id="create-event-btn" class="btn btn-black">Edit</button>
			`;

			document.getElementById("create-event-btn").addEventListener("click", ()=>{
				editEvent({"oldImageUrl": oldImageUrl});
			})

		}
	}
	
}

async function showEventContent(){
	if(page == "view-event"){
		const viewEventBlocks = document.getElementById("view-event");	
		const currentUTCdate = new Date().toISOString().substr(0,16);
		const checkResult = await checkEventId();
		
		if(checkResult[0] == false){
			showCreateEditEventError("Inexistent event");
			return;
		}

		const eventDate = new Date(checkResult[1].date * 1000).toUTCString().substr(0,25);
		const oldImageUrl = checkResult[1].image;
		eventData = checkResult[1];
		viewEventBlocks.innerHTML = 
		`<img style=" height: auto;" class="event-image" src="https://cloudflare-ipfs.com/ipfs/${checkResult[1].image}" alt="">
	        <h2>${checkResult[1].title}</h2>
	        <p><b>Event start date:</b> ${eventDate} UTC</p>
	        <p><b>Need NFT Event Pass:</b> ${(checkResult[1].nft == "true") ? "YES" : "NO"}</p>
	        <p style=" text-align: justify; ">${checkResult[1].description}</p>
	        <h4>Live stream:</h4>

	        <div id="stream-block">
	        	<div class="center">
      				<div class="lds-ripple"><div></div><div></div></div>
    			</div>
    		</div>`;

		document.getElementById("edit-event").style.display = "inherit";
		addStreamBlock(null, checkResult[1])
	}
}

async function showMintContent(address, chainId){
	if(page == "mint"){
		const mintBlock = document.getElementById("mint-block");	
		
		if(!address){
			mintBlock.innerHTML = `<div class="error">Please connect wallet</div>`;
		}
		else {
			if(!isCorrectChain(chainId)){
				mintBlock.innerHTML = `<div class="error">Please connect to ${CHAIN_NAME}</div>`;
			}
			else{
				mintBlock.innerHTML = 
				`<div class="center">
					<br>
	          		<div class="lds-ripple"><div></div><div></div></div>
	          		<p>Check if you have a NFT Pass ...</p>
	        	</div>`;

	        	address = await getConnectedWallet();
	        	hasNft = await checkNftPass(address);

				if(!hasNft){
					mintBlock.innerHTML = `<div class="error">You don't have a NFT Events Pass</div><br><button onclick="mint()" class="btn btn-black">Mint</button>`;
				} 
				else{
					mintBlock.innerHTML = `<br><div class="succes center">You have a NFT Events Pass</div><br>`;
				}
			}
		}
	}
}


async function addStreamBlock(address, data){
	const currentTimeToUtcTimestamp = toTimestamp(new Date().toUTCString());
	let hasNft = false;
	let addText = '';

	if(data.nft == "true"){
		if(!address){
			addStreamError("Stream - Please connect wallet");
		}
		else{
			document.getElementById("stream-block").innerHTML = 
			`<div class="center">
  				<div class="lds-ripple"><div></div><div></div></div>
  				<p>Check if you have a NFT Pass...</p>
			</div>`;

			hasNft = await checkNftPass(address);

			if(!hasNft){
				addStreamError(`You must have a NFT Event Pass to watch this live stream! It can be minted <a href="./mint.html"><u>here</u><a>`);
			} 
			else{
				addText = "You have NFT Event Pass, but "
			}
		}
	}

	if(data.nft == "false" || hasNft) {
		if(currentTimeToUtcTimestamp >= data.date){
			const streamBlock = document.getElementById("stream-block");
			let started;
			try{
				let response = await fetch(data.stream);
				if(response.status == 200){
					started = true;
				}
				else {
					started = false;
				};
			}
			catch(e){
				console.log(e);
			}

			if(started){
				var rnd = parseInt(Math.random() * (1000 - 0) + 0);
				streamBlock.innerHTML = 
				`<video
				    id="my-player${rnd}"
				    class="video-js my-player"
				    controls
				    preload="auto"
				    poster="https://cloudflare-ipfs.com/ipfs/${data.image}"
				    data-setup='{}'>
				  <source src="${data.stream}" type="application/x-mpegURL"></source>
				</video>
				`;
				player = videojs(`my-player${rnd}`);
			}
			else{
				addStreamError(addText + "Live stream has not yet started or has ended");
			}
		}
		else {
			addStreamError(addText + "Event has not yet started");
		}
	}
}

async function checkNftPass(address){
	try{
		const INSTANCE_EVENTS_NFT_CONTRACT = new ethers.Contract(EVENTS_NFT_CONTRACT_ADDRESS, EVENTS_NFT_CONTRACT_ABI, RPC_PROVIDER);
		let balance = await INSTANCE_EVENTS_NFT_CONTRACT.balanceOf(address);
		if(!balance || parseInt(balance._hex, 16) == 0){
			return false;
		}
		return true;
	}
	catch(e){
		console.log(e);
		return false;
	}
}


async function checkEventId(){
	showCreateEditEventLoading();
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const eventId = urlParams.get('id')

	if(eventId >= 1){
		try{
			const INSTANCE_EVENTS_CONTRACT = new ethers.Contract(EVENTS_CONTRACT_ADDRESS, EVENTS_CONTRACT_ABI, RPC_PROVIDER);
			let eventUri = await INSTANCE_EVENTS_CONTRACT.getEventByPosition(eventId);
			if(!eventUri[0]){
				return [false, null];
			}
			const data = await getOneEventInfoFromIpfs(eventUri[0]);
			return [true, data];
		}
		catch(e){
			console.log("Error");
			showCreateEditEventError(e)
			return [false, null];
		}
	}
	else {
		return [false, null];
	}
}

async function getOneEventInfoFromIpfs(cid){
	try{
		let response = await fetch("https://cloudflare-ipfs.com/ipfs/" + cid);
		if(response.status != 200){
			throw "Error: Status " + response.status;
		}
		let result = await response.json();
		return result;
	}
	catch(e){
		console.log(e);
		return {"error": e};
	}
}


async function createEvent(data){
	if(checkFormData("create", data)){
		hideCreateBtn();
		showCreateEditMessage("waiting", "Uploading to IPFS . . .");

		const eventTitle = document.getElementById("event-title");
		const eventDescription = document.getElementById("event-description");
		const eventStream = document.getElementById("event-stream");
		const eventDate = document.getElementById("event-date");
		const eventImage = document.getElementById("event-image");
		const eventNft = document.querySelector('input[name="event-nft"]:checked');

		const data = {
			"title": eventTitle.value,
	        "description": eventDescription.value,
	        "stream": eventStream.value,
	        "date": inputDateToTimestamp(),
	        "image": ["file", eventImage.files[0]],
	        "nft": eventNft.value
		}
		try{
			const cid = await uploadToIpfs(data);
			showCreateEditMessage("waiting", "Please confirm transaction on Metamask . . .");
			try {
                const contract = new web3.eth.Contract(EVENTS_CONTRACT_ABI, EVENTS_CONTRACT_ADDRESS);
                const encodedData = contract.methods.addEvent(cid).encodeABI();
                const transactionParameters = {
                    to: EVENTS_CONTRACT_ADDRESS, 
                    from: await getConnectedWallet(), 
                    data: encodedData
                };
                ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters],
                })
                .then((txHash) => {
                	clearForm();
                	showCreateBtn();
                	showCreateEditMessage("succes", "Succes. Event will appear soon in list.");
                })
                .catch((error) => {
                    console.log(error.message);
                    showFormError(error.message)
                    hideCreateEditMessage();
                    showCreateBtn();
                });
            }
            catch(error){
                console.log(error);
                showFormError(error);
                hideCreateEditMessage();
				showCreateBtn();
            }
		} catch(e){
			console.log(e);
			showFormError(e.message)
			hideCreateEditMessage();
			showCreateBtn();
		}
	}
}


async function editEvent(dataReceived){
	if(checkFormData("edit", dataReceived)){
		hideCreateBtn();
		showCreateEditMessage("waiting", "Uploading to IPFS . . .");

		const eventTitle = document.getElementById("event-title");
		const eventDescription = document.getElementById("event-description");
		const eventStream = document.getElementById("event-stream");
		const eventDate = document.getElementById("event-date");
		const eventImage = document.getElementById("event-image");
		const eventNft = document.querySelector('input[name="event-nft"]:checked');

		let image = ["file", eventImage.files[0]];

		if(!eventImage.files[0]){
			image = ["cid", dataReceived.oldImageUrl];
		}

		const data = {
			"title": eventTitle.value,
	        "description": eventDescription.value,
	        "stream": eventStream.value,
	        "date": inputDateToTimestamp(),
	        "image": image,
	        "nft": eventNft.value
		}

		try{
			const cid = await uploadToIpfs(data);
			showCreateEditMessage("waiting", "Please confirm transaction on Metamask . . .");
			try {
				const queryString = window.location.search;
				const urlParams = new URLSearchParams(queryString);
				const eventId = urlParams.get('id')
                const contract = new web3.eth.Contract(EVENTS_CONTRACT_ABI, EVENTS_CONTRACT_ADDRESS);
                const encodedData = contract.methods.editEventByPosition(eventId, cid).encodeABI();
                const transactionParameters = {
                    to: EVENTS_CONTRACT_ADDRESS, 
                    from: await getConnectedWallet(), 
                    data: encodedData
                };
                ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters],
                })
                .then((txHash) => {
                	showCreateEditMessage("succes", "Succes. Changes will take effect soon.");
                	setTimeout(() =>{showCreateEditEventForm()}, 2000);
                })
                .catch((error) => {
                    console.log(error.message);
                    showFormError(error.message)
                    hideCreateEditMessage();
                    showCreateBtn();
                });
            }
            catch(error){
                console.log(error);
				showFormError(e.message)
				hideCreateEditMessage();
				showCreateBtn();
            }
		} catch(e){
			console.log(e);
			showFormError(e.message)
			hideCreateEditMessage();
			showCreateBtn();
		}
	}
}


async function mint(){
	const mintBlock = document.getElementById("mint-block");
    mintBlock.innerHTML = `<br><div class="waiting center">Confirm transaction in Metamask ...</div><br>`;
	try {
        const INSTANCE_EVENTS_NFT_CONTRACT = new web3.eth.Contract(EVENTS_NFT_CONTRACT_ABI, EVENTS_NFT_CONTRACT_ADDRESS);
        const encodedData = INSTANCE_EVENTS_NFT_CONTRACT.methods.mintNFT().encodeABI();
        const transactionParameters = {
            to: EVENTS_NFT_CONTRACT_ADDRESS, 
            from: await getConnectedWallet(), 
            data: encodedData
        };
        ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        })
        .then((txHash) => {
        	mintBlock.innerHTML = `<br><div class="succes center">Succes. You have minted a NFT Events Pass</div><br>`;
        })
        .catch((error) => {
            console.log(error.message);
            mintBlock.innerHTML = `<div class="error">${error.message}</div><br><button onclick="mint()" class="btn btn-black">Mint</button>`
        });
    }
    catch(error){
        console.log(error);
		mintBlock.innerHTML = `<div class="error">${e.message}</div><br><button onclick="mint()" class="btn btn-black">Mint</button>`;
    }
}


async function uploadToIpfs(data){
	let cidImage;
	if(data.image[0] == "file"){
    	cidImage  = await ipfsInfura.add(data.image[1]);
    	cidImage = cidImage.path;
	}
	else if(data.image[0] == "cid"){
		cidImage = data.image[1];
	}
    const metadataObj = {
        "title": data.title,
        "description": data.description,
        "stream": data.stream,
        "date": data.date,
        "image": cidImage,
        "nft": data.nft
    }
    const cidJson  = await ipfsInfura.add(JSON.stringify(metadataObj))
    return cidJson.path;
}







function isOwner(address){
	if(address.toLowerCase() == OWNER){
		return true;
	}
	else{
		return false;
	}
}

function isCorrectChain(chain){
	if(chain == CHAIN_ID){
		return true;
	}
	else{
		return false;
	}
}


const toTimestamp = (strDate) => {  
	const dt = Date.parse(strDate);  
	return dt / 1000;  
}  

function inputDateToTimestamp(){
	const eventDate = document.getElementById("event-date");
	let eventDateObject = new Date(eventDate.value);
	let year = eventDateObject.getFullYear();
	let month = eventDateObject.getMonth();
	let date = eventDateObject.getDate();
	let hours = eventDateObject.getHours();
	let minutes = eventDateObject.getMinutes();
	return parseInt(Date.UTC(year, month, date, hours, minutes) / 1000);	
}

async function getConnectedWallet(){
	let accounts = await ethereum.request({ method: 'eth_requestAccounts' });
	return accounts[0];
}


function initMetamaskEvents(){
    if (typeof window.ethereum !== 'undefined') {
        let accounts = [];

        ethereum.on('accountsChanged', function (accounts) {
            if(accounts.length){
                if(["create-event", "edit-event"].includes(page)){
            		showCreateEditEventForm();
            	}
            	else if(page == "view-event"){
	        		addStreamBlock(accounts[0], eventData)
	        	}
	        	else if(page == "mint"){
	        		showMintContent(accounts[0], window.ethereum.networkVersion)
	        	}

                showConnectedWallet(accounts[0]);

	        	if(isOwner(accounts[0]) && page != "create-event"){
	        		showCreateEventBtn();
	        		if(page == "view-event"){
	            		showEditEventBtn()
	            	}
	        	} else {
	        		hideConnectError();
	        		hideCreateEventBtn();
	        		if(page == "view-event"){
	            		hideEditEventBtn()
	            	}
	        	}
            }
            else{
            	hideCreateEventBtn();
            	showConnectBtn();

            	if(["create-event", "edit-event"].includes(page)){
	            	showCreateEditEventError("Please connect wallet.")
	            }
	            else if(page == "view-event"){
					addStreamBlock(null, eventData)
	        	}
	        	else if(page == "mint"){
					showMintContent(null, window.ethereum.networkVersion)
	        	}
            }
        });

        ethereum.on('chainChanged', (chainId) => {
        	if(["create-event", "edit-event"].includes(page)){
            	showCreateEditEventForm();
            }
            else if(page == "view-event"){
        	}
        	else if(page == "mint"){
    			showMintContent("acc", parseInt(chainId, 16));
        	}
        });
    }
    else{
        console.log('MetaMask is not installed!');
    }
}

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        await ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts)=>{
            let account = accounts[0];
            if(account){    
            	account = account.toLowerCase();
            	showConnectedWallet(account);
            	hideConnectError();

            	if(["create-event", "edit-event"].includes(page)){
            		showCreateEditEventForm();
            	}
            	else if(page == "view-event"){
            		var refreshIntervalId = setInterval(() =>{
        				if(eventData){
        					addStreamBlock(account, eventData);
							clearInterval(refreshIntervalId);
        				}
        			}, 1000)
            	}
            	else if(page == "mint"){
            		showMintContent(account, window.ethereum.networkVersion);
            	}

            	if(isOwner(account) && page != "create-event"){
            		showCreateEventBtn();
            		if(page == "view-event"){
	            		showEditEventBtn()
	            	}
            	} 
            	else {
            		hideCreateEventBtn();
            		hideConnectError();
            		if(page == "view-event"){
	            		hideEditEventBtn()
	            	}
            	}
            }
        })
        .catch((error) => {
            if (error.code === 4001) {
                console.log('Rejected...Please connect to MetaMask.');
                showConnectError('Rejected...Please connect to MetaMask.')
            } else {
                console.log(error);
                showConnectError(error)
            }
        });
    }
    else{
        console.log('MetaMask is not installed!');
        showConnectError('MetaMask is not installed!')
    }
}
