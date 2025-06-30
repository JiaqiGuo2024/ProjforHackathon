import { create } from 'zustand';
import { Profile, MediaPost, ExtendedIdea, VaultItem, Comment } from '../types/social';
import { storage } from '../lib/storage';
import { nanoid } from 'nanoid';

interface SocialState {
  // Profiles
  profiles: Profile[];
  currentProfile: Profile | null;
  setProfiles: (profiles: Profile[]) => void;
  setCurrentProfile: (profile: Profile | null) => void;
  updateProfile: (id: string, updates: Partial<Profile>) => void;

  // Media Posts
  mediaPosts: MediaPost[];
  setMediaPosts: (posts: MediaPost[]) => void;
  addMediaPost: (post: MediaPost) => void;
  updateMediaPost: (id: string, updates: Partial<MediaPost>) => void;
  removeMediaPost: (id: string) => void;

  // Extended Ideas
  extendedIdeas: ExtendedIdea[];
  setExtendedIdeas: (ideas: ExtendedIdea[]) => void;
  addExtendedIdea: (idea: ExtendedIdea) => void;
  updateExtendedIdea: (id: string, updates: Partial<ExtendedIdea>) => void;
  removeExtendedIdea: (id: string) => void;

  // Vault
  vaultItems: VaultItem[];
  setVaultItems: (items: VaultItem[]) => void;
  addVaultItem: (item: VaultItem) => void;
  removeVaultItem: (id: string) => void;

  // Comments
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  addComment: (comment: Comment) => void;
  getCommentsForPost: (postId: string) => Comment[];

  // Actions
  initialize: () => void;
  saveToStorage: () => void;
}

export const useSocialStore = create<SocialState>((set, get) => ({
  // Profiles
  profiles: [],
  currentProfile: null,
  setProfiles: (profiles) => set({ profiles }),
  setCurrentProfile: (currentProfile) => set({ currentProfile }),
  updateProfile: (id, updates) => set(state => ({
    profiles: state.profiles.map(profile => 
      profile.id === id ? { ...profile, ...updates } : profile
    ),
    currentProfile: state.currentProfile?.id === id 
      ? { ...state.currentProfile, ...updates }
      : state.currentProfile
  })),

  // Media Posts
  mediaPosts: [],
  setMediaPosts: (mediaPosts) => set({ mediaPosts }),
  addMediaPost: (post) => set(state => ({ 
    mediaPosts: [post, ...state.mediaPosts] 
  })),
  updateMediaPost: (id, updates) => set(state => ({
    mediaPosts: state.mediaPosts.map(post => 
      post.id === id ? { ...post, ...updates } : post
    )
  })),
  removeMediaPost: (id) => set(state => ({
    mediaPosts: state.mediaPosts.filter(post => post.id !== id)
  })),

  // Extended Ideas
  extendedIdeas: [],
  setExtendedIdeas: (extendedIdeas) => set({ extendedIdeas }),
  addExtendedIdea: (idea) => set(state => ({ 
    extendedIdeas: [idea, ...state.extendedIdeas] 
  })),
  updateExtendedIdea: (id, updates) => set(state => ({
    extendedIdeas: state.extendedIdeas.map(idea => 
      idea.id === id ? { ...idea, ...updates } : idea
    )
  })),
  removeExtendedIdea: (id) => set(state => ({
    extendedIdeas: state.extendedIdeas.filter(idea => idea.id !== id)
  })),

  // Vault
  vaultItems: [],
  setVaultItems: (vaultItems) => set({ vaultItems }),
  addVaultItem: (item) => set(state => ({ 
    vaultItems: [item, ...state.vaultItems] 
  })),
  removeVaultItem: (id) => set(state => ({
    vaultItems: state.vaultItems.filter(item => item.id !== id)
  })),

  // Comments
  comments: [],
  setComments: (comments) => set({ comments }),
  addComment: (comment) => set(state => ({ 
    comments: [...state.comments, comment] 
  })),
  getCommentsForPost: (postId) => {
    return get().comments.filter(comment => comment.post_id === postId);
  },

  // Actions
  initialize: () => {
    const profiles = storage.get<Profile[]>('profiles') || [];
    const mediaPosts = storage.get<MediaPost[]>('mediaPosts') || [];
    const extendedIdeas = storage.get<ExtendedIdea[]>('extendedIdeas') || [];
    const vaultItems = storage.get<VaultItem[]>('vaultItems') || [];
    const comments = storage.get<Comment[]>('comments') || [];

    set({ profiles, mediaPosts, extendedIdeas, vaultItems, comments });
  },

  saveToStorage: () => {
    const state = get();
    storage.set('profiles', state.profiles);
    storage.set('mediaPosts', state.mediaPosts);
    storage.set('extendedIdeas', state.extendedIdeas);
    storage.set('vaultItems', state.vaultItems);
    storage.set('comments', state.comments);
  }
}));