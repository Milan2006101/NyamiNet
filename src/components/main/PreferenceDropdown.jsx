import { useState } from "react";

export default function PreferenceDropdown({ labels = [], selected = [], onChange }){
    const [open, setOpen] = useState(false);

    function toggleLabel(label){
        if (selected.includes(label)) onChange(selected.filter(s => s !== label));
        else onChange([...selected, label]);
    }

    return (    
        <>
            <button 
                className="sideButton" 
                onClick={() => setOpen(o=>!o)} 
                style={{width:'100%'}}
            >
                {selected.length ? `${selected.length} kiválasztva` : 'Válassz preferenciákat'}
            </button>
            {open && (
                <div style={{
                    marginTop:8,
                    display:'flex',
                    flexDirection:'column',
                    gap:6,
                    maxHeight:220,
                    overflow:'auto'
                }}>
                    {labels.map(label => (
                        <label 
                            key={label} 
                            style={{display:'flex',alignItems:'center',gap:8}}
                        >
                            <input 
                                type="checkbox" 
                                checked={selected.includes(label)} 
                                onChange={()=>toggleLabel(label)} 
                            />
                            <span>{label}</span>
                        </label>
                    ))}
                </div>
            )}
        </>
    );
}
