import ChangePswModal from '../components/ChangePswModal';
import ModalEliminatetAccount from '../components/ModalEliminatetAccount';



function Settings() {
    return (
        <>
            <div>
                <h1>Settings</h1>
            </div>
            <div>
                <ChangePswModal />
            </div>
            <div>
                <ModalEliminatetAccount />   
            </div>
        </>
    );
}


export default Settings;