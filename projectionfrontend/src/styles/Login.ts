import styled from "styled-components";

export const LoginGridDiv = styled.div`
width: 100vw;
height: 100vh;
display: grid;
grid-template-columns: repeat(2,1fr);
gap: 7rem;
padding: 0 2rem;
`

export const LoginBackgroundImg = styled.img`
position:fixed;
bottom: 0;
left: 0;
height: 100%;
z-index : -1;
width: 100%;
height:100%;
opacity: 0.5;
filter: opacity(0.5) brightness(0.20);
object-fit:cover;
`

export const LogoContainerDiv = styled.div`
display:flex;
justify-content:center;
align-items: center;
`

export const LogoImg = styled.img`
width: 40%;
`
export const LoginContent = styled.div`
display:flex;
justify-content:center;
align-items:center;
text-align:center;
`

export const LoginTitleP = styled.p`
font-size: 400%;
`
