import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

actor {
  type StyleRecommendation = {
    faceShape : Text;
    skinTone : Text;
    glasses : [Text];
    hairstyles : [Text];
    clothingColors : [Text];
    shoes : [Text];
  };

  var recentRecommendations : [StyleRecommendation] = [];

  func hashBlob(blob : Blob) : Nat {
    var h : Nat = 0;
    for (byte in blob.vals()) {
      h := (h * 31 + byte.toNat()) % 1_000_000_007;
    };
    h;
  };

  func pick(h : Nat, offset : Nat, size : Nat) : Nat {
    (h + offset * 137) % size;
  };

  public shared func analyzeImage(_image : Blob) : async StyleRecommendation {
    let faceShapes = ["Oval", "Round", "Square", "Heart", "Diamond"];
    let skinTones  = ["Fair", "Light", "Medium", "Olive", "Tan", "Dark"];

    // Per-face-shape glasses (opposite-shape balancing rule)
    let glassesByFace = [
      // Oval - almost anything works
      ["Square frames", "Rectangle frames", "Cat-eye frames"],
      // Round - add angles to lengthen face
      ["Rectangle frames", "Square frames", "Geometric frames"],
      // Square - soften strong angles
      ["Round frames", "Oval frames", "Aviator frames"],
      // Heart - balance wide forehead & narrow chin
      ["Aviator frames", "Round frames", "Rimless frames"],
      // Diamond - highlight eyes, soften cheekbones
      ["Cat-eye frames", "Oval frames", "Rimless frames"],
    ];

    // Per-face-shape hairstyles (balancing rule)
    let hairstylesByFace = [
      // Oval - maintain balance, most styles work
      ["Long waves", "Bob cut", "Curtain bangs"],
      // Round - make face look longer & slimmer
      ["Long layers", "High ponytail", "Side-parted hair"],
      // Square - soften sharp jawline
      ["Soft curls", "Layered hair", "Side-swept bangs"],
      // Heart - balance wide forehead & narrow chin
      ["Shoulder-length waves", "Chin-length bob", "Side-part hair"],
      // Diamond - reduce focus on wide cheekbones
      ["Textured waves", "Layered bob", "Side-part with bangs"],
    ];

    // Skin-tone matched clothing color combinations
    let clothingBySkin = [
      // Fair
      ["Soft pastels", "Light navy", "Blush pink", "Ivory white"],
      // Light
      ["Baby blue", "Lavender", "Warm beige", "Mint green"],
      // Medium
      ["Earthy terracotta", "Olive green", "Warm camel", "Rust orange"],
      // Olive
      ["Deep burgundy", "Forest green", "Rich mustard", "Warm brown"],
      // Tan
      ["Vibrant coral", "Cobalt blue", "Bright white", "Fuchsia"],
      // Dark
      ["Bold jewel tones", "Bright yellow", "Cobalt blue", "Crisp white"],
    ];

    // Shoe style sets
    let shoeOptions = [
      ["Loafers", "White sneakers", "Oxford shoes"],
      ["Chelsea boots", "Ankle boots", "Strappy sandals"],
      ["Pointed-toe flats", "Block-heel pumps", "Canvas sneakers"],
      ["Platform boots", "Mules", "Leather sandals"],
      ["Ballet flats", "Wedge sandals", "Slip-on sneakers"],
    ];

    let h = hashBlob(_image);

    let faceIdx = pick(h, 0, 5);
    let skinIdx = pick(h, 1, 6);
    let shoeSet  = pick(h, 2, 5);

    let recommendation : StyleRecommendation = {
      faceShape      = faceShapes[faceIdx];
      skinTone       = skinTones[skinIdx];
      glasses        = glassesByFace[faceIdx];
      hairstyles     = hairstylesByFace[faceIdx];
      clothingColors = clothingBySkin[skinIdx];
      shoes          = shoeOptions[shoeSet];
    };

    recentRecommendations := Array.tabulate<StyleRecommendation>(
      if (recentRecommendations.size() < 10) { recentRecommendations.size() + 1 } else { 10 },
      func(i) {
        if (i == 0) { recommendation } else { recentRecommendations[i - 1] };
      },
    );

    recommendation;
  };

  public query func getRecentRecommendations() : async [StyleRecommendation] {
    recentRecommendations;
  };
};
