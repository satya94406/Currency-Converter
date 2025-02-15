    const dropdowns = document.querySelectorAll("select");
    const btn = document.querySelector(".btn");
    const fromCur = document.getElementById("from_currency");
    const toCur = document.getElementById("to_currency");
    const amountInput = document.getElementById("amount");
    const exchangeMsg = document.getElementById("exchange_msg");

    for (let select of dropdowns) {
        for (let code in country_code_list) {
            let newOption = document.createElement("option");
            newOption.innerText = code; 
            newOption.value = code;
            select.append(newOption);
        }
    }

    fromCur.value = "USD";
    toCur.value = "INR";

    dropdowns.forEach(select => {
        select.addEventListener("change", (e) => {
            updateFlag(e.target);
            console.log(e.target);
        });
    });

    const updateFlag = (element) => {
        let currencyCode = element.value;
        let countryCode = country_code_list[currencyCode];
        let img = element.parentElement.querySelector("img");
        img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    };

    btn.addEventListener("click", async (e) => {
        e.preventDefault();
        let amountValue = parseFloat(amountInput.value);
        if (isNaN(amountValue) || amountValue <= 0) {
            amountInput.value = "1"; 
            amountValue = 1;
        }

        let fromCurrency = fromCur.value.toLowerCase();
        let toCurrency = toCur.value.toLowerCase();

        const URL = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency}.json`;
        console.log(URL);
        try {
            exchangeMsg.innerHTML = "Fetching exchange rate... ⏳";

            let response = await fetch(URL);
            let data = await response.json();
            console.log(data);
            let exchangeRate = data[fromCurrency][toCurrency];

            if (!exchangeRate) {
                exchangeMsg.innerHTML = `<span style="color:red;">Invalid currency conversion!</span>`;
                return;
            }

            let convertedAmount = (amountValue * exchangeRate).toFixed(2);

            exchangeMsg.innerHTML = `<span style="font-weight:bold; color:green;">
                ${amountValue} ${fromCur.value} = ${convertedAmount} ${toCur.value}
            </span>`;

        } catch (error) {
            exchangeMsg.innerHTML = `<span style="color:red;">Error fetching exchange rate!</span>`;
        }
    });

    document.getElementById("swap-icon").addEventListener("click", () => {
        let fromSelect = document.querySelector(".from select");
        let toSelect = document.querySelector(".to select");
        let fromImg = document.querySelector(".from img");
        let toImg = document.querySelector(".to img");
    
        let tempValue = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = tempValue;
    
        let tempSrc = fromImg.src;
        fromImg.src = toImg.src;
        toImg.src = tempSrc;
    });
    