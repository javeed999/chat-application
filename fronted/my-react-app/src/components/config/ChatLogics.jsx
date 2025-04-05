export const getSender=(loggedUser,users)=>{
    return loggedUser._id==users[0]._id ? users[1].name :users[0].name
}

export const getSenderFull=(loggedUser,users)=>{
    return loggedUser._id==users[0]._id ? users[1] :users[0]
}

export const isSameSender=(mesages,m,i,userId)=>{
    return (
        i<mesages.length-1 && 
        (mesages[i+1].sender._id!==m.sender._id ||
        mesages[i+1].sender._id!==undefined) && 
        mesages[i].sender._id!==userId
    )
}


export const isLastMessage=(messages,i,userId)=>{
    return (
        i===messages.length-1 
        &&
        messages[messages.length-1].sender._id!==userId 
        &&
        messages[messages.length-1].sender._id
    )
}


export const isSameSenderMargin=(messages,m,i,userId)=>{
    if(
        i< messages.length-1 && 
        messages[i+1].sender._id===m.sender._id && 
        messages[i].sender._id!==userId 
    )
    return 33
    else if(
        (i<messages.length-1 && messages[i+1].sender._id !== m.sender._id && 
            messages[i].sender._id!==userId )||
            (i===messages.length-1 && messages[i].sender._id !==userId)
        
    )
    return 0;
    else return "auto"
}


export const isSameUser=(message,m,i)=>{
    return i>0 && message[i-1].sender._id===m.sender._id;
}