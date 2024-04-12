import { supabase } from '../lib/supabase';

interface UserData {
    username: string;
    fid: number;
    address: string;
    loads: number;
    following: boolean;
    recasted: boolean;
}

export async function addUser(userData: UserData) {

    const { data, error } = await supabase
        .from('farnotify') // Replace with your actual table name
        .insert([{
            username: userData.username,
            fid: userData.fid,
            address: userData.address,
            loads: userData.loads,
            following: userData.following,
            recasted: userData.recasted,
        }]);

    if (error) {
        console.error("Supabase insertion error:", error);
        return false; // Return false to indicate the operation failed
    }

    return true; // Return true to indicate the operation was successful
}

export async function incrementUserTotalLoads(fid: number) {

    const { data, error } = await supabase
        .from('farnotify') // Replace with your actual table name
        .select('id, loads')
        .eq('fid', fid)
        .single();

    if (error) {
        console.log("Supabase select error:", error);
        return false; // Return false to indicate the operation failed
    }

    if (data) {
        const { error: updateError } = await supabase
            .from('farnotify') // Again, replace with your actual table name
            .update({
                loads: data.loads + 1,
                lastupdate: new Date(),
            })
            .match({ id: data.id });

        if (updateError) {
            console.log("Supabase update error:", updateError);
            return false; // Return false to indicate the operation failed
        }

        return true; // Return true to indicate the operation was successful
    } else {
        console.log("User not found for updating total loads");
        return false; // Return false to indicate the user was not found
    }
}

export async function addVerify(fid: number) {
    const { data, error: updateError } = await supabase
        .from('farnotify')
        .update({
            installed: true,
            lastupdate: new Date(),
        })
        .match({ fid: fid });
    if (updateError) {
        console.log("Supabase update error:", updateError);
        return false;
    }
    console.log("Supabase update error:", data);
    return true;
}

export async function verifyInstall(fid: number) {
    const { data, error } = await supabase
        .from('farnotify') // Replace with your actual table name
        .select('installed')
        .eq('fid', fid)
        .single();

    if (error) {
        console.log("Supabase select error:", error);
        return false; // Return false to indicate the operation failed
    }
    console.log("data", data.installed);
    if (data.installed === true) {
        return true;
    } else {
        return false;
    }

}

export async function addMinted(fid: number) {
    const { data, error: updateError } = await supabase
        .from('farnotify')
        .update({
            minted: true,
            lastupdate: new Date(),
        })
        .match({ fid: fid });
    if (updateError) {
        console.log("Supabase update error:", updateError);
        return false;
    }
    console.log("Supabase update error:", data);
    return true;
}

export async function verifyMint(fid: number) {
    const { data, error } = await supabase
        .from('farnotify') // Replace with your actual table name
        .select('minted')
        .eq('fid', fid)
        .single();

    if (error) {
        console.log("Supabase select error:", error);
        return false; // Return false to indicate the operation failed
    }
    console.log("data", data.minted);
    if (data.minted === true) {
        return true;
    } else {
        return false;
    }

}

export async function addAwarded(fid: number, award: number) {
    const { data, error: updateError } = await supabase
        .from('farnotify')
        .update({
            awarded: award,
            lastupdate: new Date(),
        })
        .match({ fid: fid });
    if (updateError) {
        console.log("Supabase update error:", updateError);
        return false;
    }
    console.log("Supabase update error:", data);
    return true;
}

export async function verifyAward(fid: number) {
    const { data, error } = await supabase
        .from('farnotify') // Replace with your actual table name
        .select('awarded')
        .eq('fid', fid)
        .single();

    if (error) {
        console.log("Supabase select error:", error);
        return 0; // Return false to indicate the operation failed
    }
    if (data) {
        return data.awarded;
    } else {
        return 0;
    }
}
