const getCommanders = (req, res, db) => {
    
    db('entrys').select('*')
    .then(cardlist => {
        console.log(cardlist.rows[1])
        let commanders = cardlist.rows.filter(card => {
            if (card.type.includes("Legendary Creature")) { 
                return true;
            }
            else if (card.type.includes("Planeswalker") && !card.modal.includes("transform") && !card.modal.includes("modal_dfc") && card.oracle_text.includes("can be your commander")) { 
                return true;
            }
        return false;
        })
        
        res.send(commanders);
    })
    .catch(error => res.status(400).json("could not get commanders"))
}

module.exports= { 
    getCommanders: getCommanders
}